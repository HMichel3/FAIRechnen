import { zodResolver } from '@hookform/resolvers/zod'
import { IonContent, IonLabel, IonPage, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react'
import { AnimatePresence } from 'motion/react'
import { map, pick, prop } from 'ramda'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RouteComponentProps } from 'react-router'
import { z } from 'zod'
import { HintAlert } from '../components/alerts/HintAlert'
import { AlertModal } from '../components/modals/AlertModal'
import { ConvertModal } from '../components/modals/ConvertModal'
import { AdditionSegment } from '../components/segments/AdditionSegment'
import { PurchaseSegment } from '../components/segments/PurchaseSegment'
import { PageFooter } from '../components/ui/PageFooter'
import { PageHeader } from '../components/ui/PageHeader'
import { useDismiss } from '../hooks/useDissmiss'
import { useOverlay } from '../hooks/useOverlay'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { NewPurchase } from '../types/common'
import { Member, Purchase } from '../types/store'
import { displayCurrencyValue, findItem, getTotalAmountFromArray } from '../utils/common'

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

type PurchasePageProps = RouteComponentProps<{
  id: string
  purchaseId?: string
}>

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
      purchaserId: memberIds[0],
      beneficiaryIds: memberIds,
      description: '',
      additions: [],
    }
  }

  return pick(['name', 'amount', 'purchaserId', 'beneficiaryIds', 'description', 'additions'], selectedPurchase)
}

export const PurchasePage = ({
  match: {
    params: { id: groupId, purchaseId },
  },
}: PurchasePageProps) => {
  const addPurchase = usePersistedStore(s => s.addPurchase)
  const editPurchase = usePersistedStore(s => s.editPurchase)
  const { members, purchases } = useStore(s => s.selectedGroup)
  const showAnimation = useStore(s => s.showAnimation)
  const selectedPurchase = findItem(purchaseId, purchases)
  const { handleSubmit, watch, setValue, formState, control } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedPurchase),
  })
  const convertOverlay = useOverlay<PurchaseFormPropertyName>()
  const cantSavePurchaseOverlay = useOverlay()
  const [showSegment, setShowSegment] = useState('purchase')
  const pageContentRef = useRef<HTMLIonContentElement>(null)
  const onDismiss = useDismiss(`/groups/${groupId}`)

  useEffect(() => {
    if (formState.errors.name || formState.errors.amount || formState.errors.beneficiaryIds)
      return setShowSegment('purchase')
    if (formState.errors.additions) setShowSegment('additions')
  }, [formState.errors])

  const onSubmit = handleSubmit(newPurchase => {
    if (getTotalAmountFromArray(newPurchase.additions) > newPurchase.amount) {
      cantSavePurchaseOverlay.onOpen()
      return
    }
    if (selectedPurchase) {
      editPurchase(groupId, selectedPurchase.id, newPurchase)
    } else {
      addPurchase(groupId, newPurchase)
    }
    showAnimation()
    onDismiss()
  })

  return (
    <IonPage>
      <PageHeader title={selectedPurchase ? 'Einkauf bearbeiten' : 'Neuer Einkauf'} onDismiss={onDismiss}>
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
      </PageHeader>
      <IonContent ref={pageContentRef}>
        <form id='purchase-form' onSubmit={onSubmit}>
          <AnimatePresence mode='wait'>
            {/* key is needed for AnimatePresence to work correctly on 2 different components */}
            {showSegment === 'purchase' && (
              <PurchaseSegment key='purchase' control={control} setShowConvertModal={convertOverlay.onSelect} />
            )}
            {showSegment === 'additions' && (
              <AdditionSegment
                key='additions'
                pageContentRef={pageContentRef}
                control={control}
                members={members}
                setShowConvertModal={convertOverlay.onSelect}
              />
            )}
          </AnimatePresence>
        </form>
      </IonContent>
      <PageFooter form='purchase-form'>Einkauf speichern</PageFooter>
      <AlertModal
        overlay={convertOverlay}
        component={ConvertModal}
        componentProps={{ onSubmit: amount => setValue(convertOverlay.selected!, amount) }}
      />
      <HintAlert
        overlay={cantSavePurchaseOverlay}
        header='Betrag zu hoch'
        message='Der Betrag der Zusätze übersteigt den Gesamtwert des Einkaufs. Bitte anpassen.'
      />
    </IonPage>
  )
}
