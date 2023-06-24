import { CompensationInfo } from './CompensationInfo'
import { PurchaseInfo } from './PurchaseInfo'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../App/animations'
import { cartSharp, serverSharp, walletSharp } from 'ionicons/icons'
import { IonAlert, useIonModal } from '@ionic/react'
import { isLast } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useRef, useState } from 'react'
import { IncomeInfo } from './IncomeInfo'
import { FilterCheckbox } from './FilterCheckbox'
import { isIncome, isPurchase } from './utils'
import { useStore } from '../../stores/useStore'
import { PurchaseModal } from '../PurchaseModal'
import { IncomeModal } from '../IncomeModal'
import { Show } from '../SolidComponents/Show'
import { isEmpty } from 'ramda'
import './index.scss'

export const PaymentSegment = (): JSX.Element => {
  const deletePurchase = usePersistedStore(s => s.deletePurchase)
  const deleteIncome = usePersistedStore(s => s.deleteIncome)
  const deleteCompensation = usePersistedStore(s => s.deleteCompensation)
  const { id: groupId, sortedPayments } = useStore(s => s.selectedGroup)

  const [showPurchases, setShowPurchases] = useState(true)
  const [showIncomes, setShowIncomes] = useState(true)
  const [showCompensations, setShowCompensations] = useState(true)
  const [showCantEditCompensation, setShowCantEditCompensation] = useState(false)
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

  return (
    <>
      {/* height is needed for the no-items-info */}
      <motion.div style={{ height: 'calc(100% - 50px)' }} variants={fadeOutLeftVariants} {...variantProps}>
        <div className='filter-payments'>
          <FilterCheckbox label='Einkäufe' checked={showPurchases} setChecked={setShowPurchases} />
          <FilterCheckbox label='Einkommen' checked={showIncomes} setChecked={setShowIncomes} />
          <FilterCheckbox label='Zahlungen' checked={showCompensations} setChecked={setShowCompensations} />
        </div>
        <Show
          when={!isEmpty(sortedPayments)}
          fallback={
            <p className='no-items-info'>
              Füge neue Einkäufe, Einkommen <br /> oder Zahlungen hinzu!
            </p>
          }
        >
          <>
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
                    transparentLine={isLast(groupPayment, filteredGroupPayments)}
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
                    transparentLine={isLast(groupPayment, filteredGroupPayments)}
                  />
                )
              }
              return (
                <SlidingListItem
                  key={groupPayment.id}
                  onDelete={() => deleteCompensation(groupId, groupPayment.id)}
                  onSelect={() => setShowCantEditCompensation(true)}
                  labelComponent={<CompensationInfo compensation={groupPayment} />}
                  icon={walletSharp}
                  detail={false}
                  transparentLine={isLast(groupPayment, filteredGroupPayments)}
                />
              )
            })}
            {/* needed so that the list entries are not hidden under the FAB */}
            <div style={{ height: 90 }} onClick={() => {}} />
          </>
        </Show>
      </motion.div>
      <IonAlert
        isOpen={showCantEditCompensation}
        onDidDismiss={() => setShowCantEditCompensation(false)}
        header='Zahlungen können nicht bearbeitet werden!'
        buttons={[{ role: 'cancel', text: 'Okay' }]}
      />
    </>
  )
}
