import { CompensationInfo } from './CompensationInfo'
import { PurchaseInfo } from './PurchaseInfo'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../App/animations'
import { cartSharp, serverSharp, walletSharp } from 'ionicons/icons'
import { IonAlert, useIonModal } from '@ionic/react'
import { isLast } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useState } from 'react'
import { IncomeInfo } from './IncomeInfo'
import { FilterCheckbox } from './FilterCheckbox'
import { isIncome, isPurchase, mergeAndSortPayments } from './utils'
import { useStore } from '../../stores/useStore'
import { Income, Purchase } from '../../stores/types'
import { PurchaseModal } from '../PurchaseModal'
import { IncomeModal } from '../IncomeModal'
import './index.scss'

export const PaymentSegment = (): JSX.Element => {
  const deletePurchase = usePersistedStore(s => s.deletePurchase)
  const deleteIncome = usePersistedStore(s => s.deleteIncome)
  const deleteCompensation = usePersistedStore(s => s.deleteCompensation)
  const { id: groupId, purchases, incomes, compensations } = useStore(s => s.selectedGroup)

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase>()
  const [selectedIncome, setSelectedIncome] = useState<Income>()
  const [showPurchases, setShowPurchases] = useState(true)
  const [showIncomes, setShowIncomes] = useState(true)
  const [showCompensations, setShowCompensations] = useState(true)
  const [showCantEditCompensation, setShowCantEditCompensation] = useState(false)

  const [showPurchaseModal, dismissPurchaseModal] = useIonModal(PurchaseModal, {
    onDismiss: () => dismissPurchaseModal(),
    selectedPurchase: selectedPurchase,
  })
  const [showIncomeModal, dismissIncomeModal] = useIonModal(IncomeModal, {
    onDismiss: () => dismissIncomeModal(),
    selectedIncome: selectedIncome,
  })

  const filteredGroupPayments = mergeAndSortPayments(
    purchases,
    incomes,
    compensations,
    showPurchases,
    showIncomes,
    showCompensations
  )

  const onSelectPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    showPurchaseModal()
  }

  const onSelectIncome = (income: Income) => {
    setSelectedIncome(income)
    showIncomeModal()
  }

  return (
    <motion.div variants={fadeOutLeftVariants} {...variantProps}>
      <div className='filter-payments'>
        <FilterCheckbox label='Einkäufe' checked={showPurchases} setChecked={setShowPurchases} />
        <FilterCheckbox label='Einkommen' checked={showIncomes} setChecked={setShowIncomes} />
        <FilterCheckbox label='Zahlungen' checked={showCompensations} setChecked={setShowCompensations} />
      </div>
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
              style={{ marginBottom: isLast(groupPayment, filteredGroupPayments) ? 91 : 0 }}
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
              style={{ marginBottom: isLast(groupPayment, filteredGroupPayments) ? 91 : 0 }}
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
            style={{ marginBottom: isLast(groupPayment, filteredGroupPayments) ? 80 : 0 }}
          />
        )
      })}
      <IonAlert
        isOpen={showCantEditCompensation}
        onDidDismiss={() => setShowCantEditCompensation(false)}
        header='Zahlungen können nicht bearbeitet werden!'
        buttons={[{ role: 'cancel', text: 'Okay' }]}
      />
    </motion.div>
  )
}
