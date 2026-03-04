import { IonChip, IonIcon, IonLabel } from '@ionic/react'
import { cartSharp, serverSharp, walletSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { useState } from 'react'
import { isEmptyish } from 'remeda'
import { useOverlay } from '../../hooks/useOverlay'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { fadeOutLeftVariants } from '../../utils/animation'
import { cn, getCompensationInfo, getIncomeInfo, getPurchaseInfo, isLast } from '../../utils/common'
import { isIncome, isPurchase } from '../../utils/payment'
import { HintAlert } from '../alerts/HintAlert'
import { PaymentInfo } from '../info/PaymentInfo'
import { FullscreenText } from '../ui/FullscreenText'
import { SlidingListItem } from '../ui/SlidingListItem'

export const PaymentSegment = () => {
  const deletePurchase = usePersistedStore(s => s.deletePurchase)
  const deleteIncome = usePersistedStore(s => s.deleteIncome)
  const deleteCompensation = usePersistedStore(s => s.deleteCompensation)
  const { id: groupId, sortedPayments, members } = useStore(s => s.selectedGroup)
  const cantEditCompensationOverlay = useOverlay()
  const [showPurchases, setShowPurchases] = useState(true)
  const [showIncomes, setShowIncomes] = useState(true)
  const [showCompensations, setShowCompensations] = useState(true)

  const filteredPayments = sortedPayments.filter(payment => {
    if (isPurchase(payment)) {
      return showPurchases
    }
    if (isIncome(payment)) {
      return showIncomes
    }
    return showCompensations
  })

  if (isEmptyish(sortedPayments)) {
    return (
      <FullscreenText>
        Füge neue Einkäufe, Einkommen
        <br />
        oder Zahlungen hinzu!
      </FullscreenText>
    )
  }

  return (
    <motion.div className='h-full' {...fadeOutLeftVariants}>
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
      <div className='pb-20'>
        {filteredPayments.map((payment, index) => {
          if (isPurchase(payment)) {
            const { purchaser } = getPurchaseInfo(payment, members)
            return (
              <SlidingListItem
                key={payment.id}
                icon={cartSharp}
                label={<PaymentInfo {...payment} subtitle={`Von ${purchaser?.name}`} />}
                routerLink={`/groups/${groupId}/purchase/${payment.id}`}
                onDelete={() => deletePurchase(groupId, payment.id)}
                lines={isLast(index, filteredPayments) ? 'none' : 'inset'}
              />
            )
          }
          if (isIncome(payment)) {
            const { earner } = getIncomeInfo(payment, members)
            return (
              <SlidingListItem
                key={payment.id}
                icon={serverSharp}
                label={<PaymentInfo {...payment} subtitle={`Von ${earner?.name}`} />}
                routerLink={`/groups/${groupId}/income/${payment.id}`}
                onDelete={() => deleteIncome(groupId, payment.id)}
                lines={isLast(index, filteredPayments) ? 'none' : 'inset'}
              />
            )
          }
          const { payer, receiver } = getCompensationInfo(payment, members)
          return (
            <SlidingListItem
              key={payment.id}
              icon={walletSharp}
              label={<PaymentInfo {...payment} name={payer!.name} subtitle={`An ${receiver?.name}`} />}
              onClick={() => cantEditCompensationOverlay.onOpen()}
              onDelete={() => deleteCompensation(groupId, payment.id)}
              lines={isLast(index, filteredPayments) ? 'none' : 'inset'}
            />
          )
        })}
      </div>
      <HintAlert
        overlay={cantEditCompensationOverlay}
        header='Bearbeiten nicht möglich'
        message='Zahlungen können nicht geändert, sondern nur gelöscht und neu angelegt werden.'
      />
    </motion.div>
  )
}
