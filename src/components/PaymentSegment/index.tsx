import { CompensationInfo } from './CompensationInfo'
import { PurchaseInfo } from './PurchaseInfo'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../App/animations'
import { cartSharp, serverSharp, walletSharp } from 'ionicons/icons'
import { IonAlert } from '@ionic/react'
import { usePaymentSegment } from './usePaymentSegment'
import { displayMembersNotExistingInAlert, equalsLast, isIncome, isPurchase } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useState } from 'react'
import { IncomeInfo } from './IncomeInfo'
import { isEmpty } from 'ramda'
import { FilterCheckbox } from './FilterCheckbox'
import './index.scss'
import { Member } from '../../App/types'

export const PaymentSegment = (): JSX.Element => {
  const deletePurchase = usePersistedStore.useDeletePurchase()
  const deleteIncome = usePersistedStore.useDeleteIncome()
  const deleteCompensation = usePersistedStore.useDeleteCompensation()
  const [showPurchases, setShowPurchases] = useState(true)
  const [showIncomes, setShowIncomes] = useState(true)
  const [showCompensations, setShowCompensations] = useState(true)
  const [purchaseMembersNotExisting, setPurchaseMembersNotExisting] = useState<Member[]>([])
  const [incomeMembersNotExisting, setIncomeMembersNotExisting] = useState<Member[]>([])
  const [showCantEditCompensation, setShowCantEditCompensation] = useState(false)
  const { filteredGroupPayments, onSelectPurchase, onSelectIncome } = usePaymentSegment(
    showPurchases,
    showIncomes,
    showCompensations,
    setPurchaseMembersNotExisting,
    setIncomeMembersNotExisting
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
              key={groupPayment.id}
              onDelete={() => deletePurchase(groupPayment.id)}
              onSelect={() => onSelectPurchase(groupPayment)}
              labelComponent={<PurchaseInfo purchase={groupPayment} />}
              icon={cartSharp}
              detail={false}
              lines={equalsLast(groupPayment, filteredGroupPayments) ? 'none' : undefined}
              style={{ marginBottom: equalsLast(groupPayment, filteredGroupPayments) ? 92 : 0 }}
            />
          )
        }
        if (isIncome(groupPayment)) {
          return (
            <SlidingListItem
              key={groupPayment.id}
              onDelete={() => deleteIncome(groupPayment.id)}
              onSelect={() => onSelectIncome(groupPayment)}
              labelComponent={<IncomeInfo income={groupPayment} />}
              icon={serverSharp}
              detail={false}
              lines={equalsLast(groupPayment, filteredGroupPayments) ? 'none' : undefined}
              style={{ marginBottom: equalsLast(groupPayment, filteredGroupPayments) ? 92 : 0 }}
            />
          )
        }
        return (
          <SlidingListItem
            key={groupPayment.id}
            onDelete={() => deleteCompensation(groupPayment.id)}
            onSelect={() => setShowCantEditCompensation(true)}
            labelComponent={<CompensationInfo compensation={groupPayment} />}
            icon={walletSharp}
            detail={false}
            lines={equalsLast(groupPayment, filteredGroupPayments) ? 'none' : undefined}
            style={{ marginBottom: equalsLast(groupPayment, filteredGroupPayments) ? 81 : 0 }}
          />
        )
      })}
      <IonAlert
        isOpen={!isEmpty(purchaseMembersNotExisting)}
        onDidDismiss={() => setPurchaseMembersNotExisting([])}
        header='Dieser Einkauf kann nicht bearbeitet werden!'
        message={`Es können keine Einkäufe bearbeitet werden, welche bereits gelöschte Mitglieder beinhalten:
          ${displayMembersNotExistingInAlert(purchaseMembersNotExisting)}
        `}
        buttons={[{ role: 'cancel', text: 'Okay' }]}
      />
      <IonAlert
        isOpen={!isEmpty(incomeMembersNotExisting)}
        onDidDismiss={() => setIncomeMembersNotExisting([])}
        header='Dieses Einkommen kann nicht bearbeitet werden!'
        message={`Es können keine Einkommen bearbeitet werden, welche bereits gelöschte Mitglieder beinhalten: 
          ${displayMembersNotExistingInAlert(incomeMembersNotExisting)}
        `}
        buttons={[{ role: 'cancel', text: 'Okay' }]}
      />
      <IonAlert
        isOpen={showCantEditCompensation}
        onDidDismiss={() => setShowCantEditCompensation(false)}
        header='Zahlungen können nicht bearbeitet werden!'
        buttons={[{ role: 'cancel', text: 'Okay' }]}
      />
    </motion.div>
  )
}
