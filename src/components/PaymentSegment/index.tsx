import { CompensationInfo } from './CompensationInfo'
import { PurchaseInfo } from './PurchaseInfo'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../App/animations'
import { cartSharp, cashSharp, walletSharp } from 'ionicons/icons'
import { IonAlert } from '@ionic/react'
import { usePaymentSegment } from './usePaymentSegment'
import { displayMembersNotExistingInAlert, equalsLast, isIncome, isPurchase } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useState } from 'react'
import { IncomeInfo } from './IncomeInfo'
import { isEmpty } from 'ramda'

export const PaymentSegment = (): JSX.Element => {
  const {
    groupPayments,
    purchaseMembersNotExisting,
    setPurchaseMembersNotExisting,
    incomeMembersNotExisting,
    setIncomeMembersNotExisting,
    onSelectPurchase,
    onSelectIncome,
  } = usePaymentSegment()
  const deletePurchase = usePersistedStore.useDeletePurchase()
  const deleteIncome = usePersistedStore.useDeleteIncome()
  const deleteCompensation = usePersistedStore.useDeleteCompensation()
  const [showCantEditCompensation, setShowCantEditCompensation] = useState(false)

  return (
    <motion.div variants={fadeOutLeftVariants} {...variantProps}>
      {groupPayments.map(groupPayment => {
        if (isPurchase(groupPayment)) {
          return (
            <SlidingListItem
              key={groupPayment.id}
              onDelete={() => deletePurchase(groupPayment.id)}
              onSelect={() => onSelectPurchase(groupPayment)}
              labelComponent={<PurchaseInfo purchase={groupPayment} />}
              icon={cartSharp}
              detail={false}
              lines={equalsLast(groupPayment, groupPayments) ? 'none' : undefined}
              style={{ marginBottom: equalsLast(groupPayment, groupPayments) ? 92 : 0 }}
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
              icon={cashSharp}
              detail={false}
              lines={equalsLast(groupPayment, groupPayments) ? 'none' : undefined}
              style={{ marginBottom: equalsLast(groupPayment, groupPayments) ? 92 : 0 }}
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
            lines={equalsLast(groupPayment, groupPayments) ? 'none' : undefined}
            style={{ marginBottom: equalsLast(groupPayment, groupPayments) ? 81 : 0 }}
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
