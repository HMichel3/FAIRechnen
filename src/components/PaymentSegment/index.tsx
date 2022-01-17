import { CompensationInfo } from './CompensationInfo'
import { PurchaseInfo } from './PurchaseInfo'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { fadeOutLeftVariants, variantProps } from '../../App/animations'
import { cartSharp, walletSharp } from 'ionicons/icons'
import { IonAlert } from '@ionic/react'
import { usePaymentSegment } from './usePaymentSegment'
import { equalsLast, isPurchase } from '../../App/utils'

export const PaymentSegment = (): JSX.Element => {
  const {
    groupPayments,
    showCantEditPurchase,
    setShowCantEditPurchase,
    showCantEditCompensation,
    setShowCantEditCompensation,
    deletePurchase,
    deleteCompensation,
    onSelectPurchase,
  } = usePaymentSegment()

  return (
    <motion.div variants={fadeOutLeftVariants} {...variantProps}>
      {groupPayments.map(groupPayment =>
        isPurchase(groupPayment) ? (
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
        ) : (
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
      )}
      <IonAlert
        isOpen={showCantEditPurchase}
        onDidDismiss={() => setShowCantEditPurchase(false)}
        header='Dieser Einkauf kann nicht bearbeitet werden!'
        message='Es können lediglich diejenigen Einkäufe bearbeitet werden, bei welchen noch alle beteiligten Mitglieder vorhanden sind.'
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
