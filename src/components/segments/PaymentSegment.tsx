import { IonChip, IonIcon, IonLabel } from '@ionic/react'
import { cartSharp, serverSharp, walletSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { useState } from 'react'
import { isEmpty } from 'remeda'
import { GroupData } from '../../hooks/useGroupData'
import { useOverlay } from '../../hooks/useOverlay'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { fadeOutLeftVariants } from '../../utils/animation'
import { cn, getCompensationInfo, getIncomeInfo, getPurchaseInfo } from '../../utils/common'
import { isIncome, isLast, isPurchase } from '../../utils/guard'
import { HintAlert } from '../alerts/HintAlert'
import { PaymentInfo } from '../info/PaymentInfo'
import { FullscreenText } from '../ui/FullscreenText'
import { SlidingListItem } from '../ui/SlidingListItem'

type PaymentSegmentProps = {
  groupData: GroupData
}

export const PaymentSegment = ({ groupData }: PaymentSegmentProps) => {
  const deletePurchase = usePersistedStore(s => s.deletePurchase)
  const deleteIncome = usePersistedStore(s => s.deleteIncome)
  const deleteCompensation = usePersistedStore(s => s.deleteCompensation)
  const cantEditCompensationOverlay = useOverlay()
  const [showPurchases, setShowPurchases] = useState(true)
  const [showIncomes, setShowIncomes] = useState(true)
  const [showCompensations, setShowCompensations] = useState(true)

  const filteredPayments = groupData.sortedPayments.filter(payment => {
    if (isPurchase(payment)) {
      return showPurchases
    }
    if (isIncome(payment)) {
      return showIncomes
    }
    return showCompensations
  })

  if (isEmpty(groupData.sortedPayments)) {
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
            const { purchaser } = getPurchaseInfo(payment, groupData.members)
            return (
              <SlidingListItem
                key={payment.id}
                icon={cartSharp}
                label={<PaymentInfo {...payment} subtitle={`Von ${purchaser?.name}`} />}
                routerLink={`/groups/${groupData.id}/purchase/${payment.id}`}
                onDelete={() => deletePurchase(groupData.id, payment.id)}
                lines={isLast(index, filteredPayments) ? 'none' : 'inset'}
              />
            )
          }
          if (isIncome(payment)) {
            const { earner } = getIncomeInfo(payment, groupData.members)
            return (
              <SlidingListItem
                key={payment.id}
                icon={serverSharp}
                label={<PaymentInfo {...payment} subtitle={`Von ${earner?.name}`} />}
                routerLink={`/groups/${groupData.id}/income/${payment.id}`}
                onDelete={() => deleteIncome(groupData.id, payment.id)}
                lines={isLast(index, filteredPayments) ? 'none' : 'inset'}
              />
            )
          }
          const { payer, receiver } = getCompensationInfo(payment, groupData.members)
          return (
            <SlidingListItem
              key={payment.id}
              icon={walletSharp}
              label={<PaymentInfo {...payment} name={payer!.name} subtitle={`An ${receiver?.name}`} />}
              onClick={() => cantEditCompensationOverlay.onOpen()}
              onDelete={() => deleteCompensation(groupData.id, payment.id)}
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
