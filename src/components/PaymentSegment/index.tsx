import { CompensationInfo } from './CompensationInfo'
import { PurchaseInfo } from './PurchaseInfo'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../App/animations'
import { cartSharp, serverSharp, walletSharp } from 'ionicons/icons'
import { IonChip, IonText, useIonAlert, useIonModal } from '@ionic/react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useRef, useState } from 'react'
import { IncomeInfo } from './IncomeInfo'
import { isIncome, isPurchase } from './utils'
import { useStore } from '../../stores/useStore'
import { PurchaseModal } from '../PurchaseModal'
import { IncomeModal } from '../IncomeModal'
import { Show } from '../SolidComponents/Show'
import { isEmpty } from 'ramda'
import { Income, Purchase } from '../../stores/types'
import { cn } from '../../App/utils'

export const PaymentSegment = (): JSX.Element => {
  const deletePurchase = usePersistedStore(s => s.deletePurchase)
  const deleteIncome = usePersistedStore(s => s.deleteIncome)
  const deleteCompensation = usePersistedStore(s => s.deleteCompensation)
  const { id: groupId, sortedPayments } = useStore(s => s.selectedGroup)
  const [presentCantEditCompensation] = useIonAlert()
  const [showPurchases, setShowPurchases] = useState(true)
  const [showIncomes, setShowIncomes] = useState(true)
  const [showCompensations, setShowCompensations] = useState(true)
  const selectedPurchaseRef = useRef<Purchase | null>()
  const selectedIncomeRef = useRef<Income | null>()

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

  const filteredGroupPayments = sortedPayments.filter(payment => {
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
          Einkäufe
        </IonChip>
        <IonChip
          color={cn({ medium: !showIncomes, primary: showIncomes })}
          onClick={() => setShowIncomes(prev => !prev)}
        >
          Einkommen
        </IonChip>
        <IonChip
          color={cn({ medium: !showCompensations, primary: showCompensations })}
          onClick={() => setShowCompensations(prev => !prev)}
        >
          Zahlungen
        </IonChip>
      </div>
      <Show
        when={!isEmpty(sortedPayments)}
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
          {filteredGroupPayments.map(groupPayment => {
            if (isPurchase(groupPayment)) {
              return (
                <SlidingListItem
                  key={groupPayment.id}
                  onDelete={() => deletePurchase(groupId, groupPayment.id)}
                  onSelect={() => onSelectPurchase(groupPayment)}
                  labelComponent={<PurchaseInfo purchase={groupPayment} />}
                  icon={cartSharp}
                  detail={false}
                />
              )
            }
            if (isIncome(groupPayment)) {
              return (
                <SlidingListItem
                  key={groupPayment.id}
                  onDelete={() => deleteIncome(groupId, groupPayment.id)}
                  onSelect={() => onSelectIncome(groupPayment)}
                  labelComponent={<IncomeInfo income={groupPayment} />}
                  icon={serverSharp}
                  detail={false}
                />
              )
            }
            return (
              <SlidingListItem
                key={groupPayment.id}
                onDelete={() => deleteCompensation(groupId, groupPayment.id)}
                onSelect={onSelectCompensation}
                labelComponent={<CompensationInfo compensation={groupPayment} />}
                icon={walletSharp}
                detail={false}
              />
            )
          })}
        </div>
      </Show>
    </motion.div>
  )
}
