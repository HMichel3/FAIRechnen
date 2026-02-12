import { IonChip, IonIcon, IonLabel, IonText, useIonAlert, useIonModal } from '@ionic/react'
import { cartSharp, serverSharp, walletSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { isNotEmpty } from 'ramda'
import { useRef, useState } from 'react'
import { fadeOutLeftVariants, variantProps } from '../../App/animations'
import { cn, getCompensationInfo, getIncomeInfo, getPurchaseInfo, isLast } from '../../App/utils'
import { Income, Purchase } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { IncomeModal } from '../IncomeModal'
import { PurchaseModal } from '../PurchaseModal'
import { SlidingListItem } from '../SlidingListItem'
import { Show } from '../SolidComponents/Show'
import { PaymentInfo } from './PaymentInfo'
import { isIncome, isPurchase } from './utils'

export const PaymentSegment = (): JSX.Element => {
  const deletePurchase = usePersistedStore(s => s.deletePurchase)
  const deleteIncome = usePersistedStore(s => s.deleteIncome)
  const deleteCompensation = usePersistedStore(s => s.deleteCompensation)
  const { id: groupId, sortedPayments, members } = useStore(s => s.selectedGroup)
  const [presentCantEditCompensation] = useIonAlert()
  const [showPurchases, setShowPurchases] = useState(true)
  const [showIncomes, setShowIncomes] = useState(true)
  const [showCompensations, setShowCompensations] = useState(true)
  const selectedPurchaseRef = useRef<Purchase | null>(null)
  const selectedIncomeRef = useRef<Income | null>(null)

  const [showPurchaseModal, dismissPurchaseModal] = useIonModal(PurchaseModal, {
    onDismiss: () => {
      selectedPurchaseRef.current = null
      dismissPurchaseModal()
    },
    selectedPurchase: selectedPurchaseRef.current,
  })
  const [showIncomeModal, dismissIncomeModal] = useIonModal(IncomeModal, {
    onDismiss: () => {
      selectedIncomeRef.current = null
      dismissIncomeModal()
    },
    selectedIncome: selectedIncomeRef.current,
  })

  const filteredPayments = sortedPayments.filter(payment => {
    if (isPurchase(payment)) {
      return showPurchases
    }
    if (isIncome(payment)) {
      return showIncomes
    }
    return showCompensations
  })

  const onSelectPurchase = (purchase: Purchase) => {
    selectedPurchaseRef.current = purchase
    showPurchaseModal()
  }

  const onSelectIncome = (income: Income) => {
    selectedIncomeRef.current = income
    showIncomeModal()
  }

  const onSelectCompensation = () => {
    presentCantEditCompensation({
      header: 'Zahlungen können nicht bearbeitet werden!',
      buttons: [{ role: 'confirm', text: 'Okay', cssClass: 'alert-button-ok' }],
    })
  }

  return (
    <motion.div className='h-full' variants={fadeOutLeftVariants} {...variantProps}>
      <div className='flex justify-center p-2'>
        <IonChip
          color={cn({ medium: !showPurchases, primary: showPurchases })}
          onClick={() => setShowPurchases(prev => !prev)}
        >
          <IonIcon icon={cartSharp} />
          <IonLabel>Einkäufe</IonLabel>
        </IonChip>
        <IonChip
          color={cn({ medium: !showIncomes, primary: showIncomes })}
          onClick={() => setShowIncomes(prev => !prev)}
        >
          <IonIcon icon={serverSharp} />
          <IonLabel>Einkommen</IonLabel>
        </IonChip>
        <IonChip
          color={cn({ medium: !showCompensations, primary: showCompensations })}
          onClick={() => setShowCompensations(prev => !prev)}
        >
          <IonIcon icon={walletSharp} />
          <IonLabel>Zahlungen</IonLabel>
        </IonChip>
      </div>
      <Show
        when={isNotEmpty(sortedPayments)}
        fallback={
          <IonText
            className='grid place-items-center text-center text-lg text-neutral-400'
            style={{ height: 'calc(100% - 56px)' }}
          >
            Füge neue Einkäufe, Einkommen
            <br />
            oder Zahlungen hinzu!
          </IonText>
        }
      >
        <div className='pb-20'>
          {filteredPayments.map((payment, index) => {
            if (isPurchase(payment)) {
              const { purchaser } = getPurchaseInfo(payment, members)
              return (
                <SlidingListItem
                  key={payment.id}
                  onDelete={() => deletePurchase(groupId, payment.id)}
                  onSelect={() => onSelectPurchase(payment)}
                  labelComponent={<PaymentInfo {...payment} subtitle={`Von ${purchaser?.name}`} />}
                  icon={cartSharp}
                  detail={false}
                  lines={isLast(index, filteredPayments) ? 'none' : 'inset'}
                />
              )
            }
            if (isIncome(payment)) {
              const { earner } = getIncomeInfo(payment, members)
              return (
                <SlidingListItem
                  key={payment.id}
                  onDelete={() => deleteIncome(groupId, payment.id)}
                  onSelect={() => onSelectIncome(payment)}
                  labelComponent={<PaymentInfo {...payment} subtitle={`Von ${earner?.name}`} />}
                  icon={serverSharp}
                  detail={false}
                  lines={isLast(index, filteredPayments) ? 'none' : 'inset'}
                />
              )
            }
            const { payer, receiver } = getCompensationInfo(payment, members)
            return (
              <SlidingListItem
                key={payment.id}
                onDelete={() => deleteCompensation(groupId, payment.id)}
                onSelect={onSelectCompensation}
                labelComponent={<PaymentInfo {...payment} name={payer!.name} subtitle={`An ${receiver?.name}`} />}
                icon={walletSharp}
                detail={false}
                lines={isLast(index, filteredPayments) ? 'none' : 'inset'}
              />
            )
          })}
        </div>
      </Show>
    </motion.div>
  )
}
