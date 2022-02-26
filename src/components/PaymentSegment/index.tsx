import { CompensationInfo } from './CompensationInfo'
import { PurchaseInfo } from './PurchaseInfo'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../App/animations'
import { cartSharp, serverSharp, walletSharp } from 'ionicons/icons'
import { IonAlert } from '@ionic/react'
import { usePaymentSegment } from './usePaymentSegment'
import { isLast } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useState } from 'react'
import { IncomeInfo } from './IncomeInfo'
import { FilterCheckbox } from './FilterCheckbox'
import { filterGroupPayments, isIncome, isPurchase } from './utils'
import { useDeepCompareMemo } from '../../hooks/useDeepCompareMemo'
import { useStore } from '../../stores/useStore'
import './index.scss'

export const PaymentSegment = (): JSX.Element => {
  const deletePurchase = usePersistedStore.useDeletePurchase()
  const deleteIncome = usePersistedStore.useDeleteIncome()
  const deleteCompensation = usePersistedStore.useDeleteCompensation()
  const { groupPayments } = useStore.useSelectedGroup()
  const [showPurchases, setShowPurchases] = useState(true)
  const [showIncomes, setShowIncomes] = useState(true)
  const [showCompensations, setShowCompensations] = useState(true)
  const [showCantEditCompensation, setShowCantEditCompensation] = useState(false)
  const { onSelectPurchase, onSelectIncome } = usePaymentSegment()
  const filteredGroupPayments = useDeepCompareMemo(
    () => filterGroupPayments(groupPayments, showPurchases, showIncomes, showCompensations),
    [groupPayments, showPurchases, showIncomes, showCompensations]
  )

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
              key={groupPayment.purchaseId}
              onDelete={() => deletePurchase(groupPayment.purchaseId)}
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
              key={groupPayment.incomeId}
              onDelete={() => deleteIncome(groupPayment.incomeId)}
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
            key={groupPayment.compensationId}
            onDelete={() => deleteCompensation(groupPayment.compensationId)}
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
