import { IonAlert, IonContent, IonLabel, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react'
import { Member, Purchase } from '../../stores/types'
import { AdditionSegment } from './AdditionSegment'
import { PurchaseSegment } from './PurchaseSegment'
import { useEffect, useRef, useState } from 'react'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { AnimatePresence } from 'framer-motion'
import { displayCurrencyValue, getTotalAmountFromArray } from '../../App/utils'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { z } from 'zod'
import { NewPurchase } from '../../App/types'
import { map, pick, prop } from 'ramda'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
  const { handleSubmit, watch, formState, control } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedPurchase),
  })
  const [showSegment, setShowSegment] = useState('purchase')
  const [showAdditionError, setShowAdditionError] = useState(false)
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  const onSubmit = handleSubmit(newPurchase => {
    setShowAdditionError(false)
    if (getTotalAmountFromArray(newPurchase.additions) > newPurchase.amount) {
      return setShowAdditionError(true)
    }
    if (selectedPurchase) {
      editPurchase(groupId, selectedPurchase.id, newPurchase)
    } else {
      addPurchase(groupId, newPurchase)
    }
    setShowAnimation()
    onDismiss()
  })

  useEffect(() => {
    if (formState.errors.name || formState.errors.amount || formState.errors.beneficiaryIds)
      return setShowSegment('purchase')
    if (formState.errors.additions) setShowSegment('additions')
  }, [formState.errors])

  return (
    <form className='flex-column-full-height' onSubmit={onSubmit}>
      <ModalHeader title={selectedPurchase ? 'Einkauf bearbeiten' : 'Neuer Einkauf'} onDismiss={onDismiss}>
        <IonToolbar color='dark'>
          <IonSegment value={showSegment} onIonChange={({ detail }) => setShowSegment(detail.value!)}>
            <IonSegmentButton value='purchase'>
              <IonLabel>Einkauf ({displayCurrencyValue(watch('amount'))})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='additions'>
              <IonLabel>Zusätze ({displayCurrencyValue(getTotalAmountFromArray(watch('additions')))})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </ModalHeader>
      <IonContent ref={pageContentRef}>
        <AnimatePresence mode='wait'>
          {/* Key prop is needed for AnimatePresence to work correctly on 2 different Components */}
          {showSegment === 'purchase' && <PurchaseSegment key='purchase' control={control} />}
          {showSegment === 'additions' && (
            <AdditionSegment key='additions' pageContentRef={pageContentRef} control={control} />
          )}
        </AnimatePresence>
        <IonAlert
          isOpen={showAdditionError}
          onDidDismiss={() => setShowAdditionError(false)}
          header='Einkauf kann nicht gespeichert werden!'
          message='Der Gesamtbetrag aller Zusätze darf den Einkaufswert nicht überschreiten.'
          buttons={[{ role: 'cancel', text: 'Okay' }]}
        />
      </IonContent>
      <ModalFooter>Einkauf speichern</ModalFooter>
    </form>
  )
}
