import { IonContent, IonLabel, IonSegment, IonSegmentButton, IonToolbar, useIonAlert } from '@ionic/react'
import { AdditionSegment } from './AdditionSegment'
import { PurchaseSegment } from './PurchaseSegment'
import { useEffect, useRef, useState } from 'react'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { AnimatePresence } from 'framer-motion'
import { displayCurrencyValue, getTotalAmountFromArray } from '../../App/utils'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { isEmpty, map, pick, prop } from 'ramda'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Show } from '../SolidComponents/Show'
import { ConvertModal } from './PurchaseSegment/ConvertModal'
import { NewPurchase } from '../../App/types'
import { Member, Purchase } from '../../stores/types'

export type PurchaseFormPropertyName =
  | 'name'
  | 'amount'
  | 'purchaserId'
  | 'beneficiaryIds'
  | 'description'
  | 'additions'
  | `beneficiaryIds.${number}`
  | `additions.${number}`
  | `additions.${number}.name`
  | `additions.${number}.amount`
  | `additions.${number}.payerIds`
  | `additions.${number}.payerIds.${number}`

interface PurchaseModalProps {
  onDismiss: () => void
  selectedPurchase?: Purchase
}

const validationSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  purchaserId: z.string().min(1),
  beneficiaryIds: z.string().array().nonempty(),
  description: z.string(),
  additions: z
    .object({
      name: z.string().trim().min(1),
      amount: z.number().positive(),
      payerIds: z.string().array().nonempty(),
    })
    .array(),
})

const defaultValues = (members: Member[], selectedPurchase?: Purchase): NewPurchase => {
  if (!selectedPurchase) {
    const memberIds = map(prop('id'), members)
    return {
      name: '',
      amount: 0,
      purchaserId: memberIds.at(0)!,
      beneficiaryIds: memberIds,
      description: '',
      additions: [],
    }
  }

  return pick(['name', 'amount', 'purchaserId', 'beneficiaryIds', 'description', 'additions'], selectedPurchase)
}

export const PurchaseModal = ({ onDismiss, selectedPurchase }: PurchaseModalProps): JSX.Element => {
  const addPurchase = usePersistedStore(s => s.addPurchase)
  const editPurchase = usePersistedStore(s => s.editPurchase)
  const { id: groupId, members } = useStore(s => s.selectedGroup)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const { handleSubmit, watch, setValue, formState, control } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedPurchase),
  })
  const [presentAdditionError] = useIonAlert()
  const [showSegment, setShowSegment] = useState('purchase')
  const [showConvertModal, setShowConvertModal] = useState<PurchaseFormPropertyName | ''>('')
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  useEffect(() => {
    if (formState.errors.name || formState.errors.amount || formState.errors.beneficiaryIds)
      return setShowSegment('purchase')
    if (formState.errors.additions) setShowSegment('additions')
  }, [formState.errors])

  const onSubmit = handleSubmit(newPurchase => {
    if (getTotalAmountFromArray(newPurchase.additions) > newPurchase.amount) {
      return presentAdditionError({
        header: 'Einkauf kann nicht gespeichert werden!',
        message: 'Der Gesamtbetrag aller Zusätze darf den Einkaufswert nicht überschreiten.',
        buttons: [{ role: 'confirm', text: 'Okay', cssClass: 'alert-button-ok' }],
      })
    }
    if (selectedPurchase) {
      editPurchase(groupId, selectedPurchase.id, newPurchase)
    } else {
      addPurchase(groupId, newPurchase)
    }
    setShowAnimation()
    onDismiss()
  })

  return (
    <form onSubmit={onSubmit} className='flex flex-1 flex-col'>
      <ModalHeader title={selectedPurchase ? 'Einkauf bearbeiten' : 'Neuer Einkauf'} onDismiss={onDismiss}>
        <IonToolbar>
          <IonSegment value={showSegment}>
            <IonSegmentButton value='purchase' onClick={() => setShowSegment('purchase')}>
              <IonLabel>Einkauf ({displayCurrencyValue(watch('amount'))})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='additions' onClick={() => setShowSegment('additions')}>
              <IonLabel>Zusätze ({displayCurrencyValue(getTotalAmountFromArray(watch('additions')))})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </ModalHeader>
      <IonContent ref={pageContentRef}>
        <AnimatePresence mode='wait'>
          {/* Key prop is needed for AnimatePresence to work correctly on 2 different Components */}
          {showSegment === 'purchase' && (
            <PurchaseSegment key='purchase' control={control} setShowConvertModal={setShowConvertModal} />
          )}
          {showSegment === 'additions' && (
            <AdditionSegment
              key='additions'
              pageContentRef={pageContentRef}
              control={control}
              members={members}
              setShowConvertModal={setShowConvertModal}
            />
          )}
        </AnimatePresence>
      </IonContent>
      <ModalFooter>Einkauf speichern</ModalFooter>
      <Show when={!isEmpty(showConvertModal)}>
        <ConvertModal
          setFormAmount={amount => setValue(showConvertModal as PurchaseFormPropertyName, amount)}
          onDismiss={() => setShowConvertModal('')}
        />
      </Show>
    </form>
  )
}
