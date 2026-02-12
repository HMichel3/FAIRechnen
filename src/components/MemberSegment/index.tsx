import { IonText, useIonAlert, useIonModal } from '@ionic/react'
import { personSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { isNotEmpty } from 'ramda'
import { useRef } from 'react'
import { fadeOutRightVariants, variantProps } from '../../App/animations'
import { cn, displayCurrencyValue, isLast, isNegative, isPositive } from '../../App/utils'
import { Member } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { MemberInfo } from '../MemberInfo'
import { MemberModal } from '../MemberModal'
import { SlidingListItem } from '../SlidingListItem'
import { Show } from '../SolidComponents/Show'
import { isMemberInvolved } from './utils'

export const MemberSegment = (): JSX.Element => {
  const { id: groupId, purchases, incomes, compensations, membersWithAmounts } = useStore(s => s.selectedGroup)
  const deleteMember = usePersistedStore(s => s.deleteMember)
  const [presentCantDeleteMember] = useIonAlert()
  const selectedMemberRef = useRef<Member | null>(null)

  const [showMemberModal, dismissMemberModal] = useIonModal(MemberModal, {
    onDismiss: () => {
      selectedMemberRef.current = null
      dismissMemberModal()
    },
    selectedMember: selectedMemberRef.current,
  })

  const onSelectMember = (member: Member) => {
    selectedMemberRef.current = member
    showMemberModal()
  }

  const onDeleteMember = (memberId: string, memberInvolved: boolean) => {
    if (memberInvolved) {
      return presentCantDeleteMember({
        header: 'Mitglied kann nicht gelöscht werden!',
        message:
          'Mitglieder, welche an Einkäufen, Einkommen oder Zahlungen beteiligt sind, können nicht gelöscht werden. Bearbeiten Sie erst die betroffenen Einträge.',
        buttons: [{ role: 'confirm', text: 'Okay', cssClass: 'alert-button-ok' }],
      })
    }
    deleteMember(groupId, memberId)
  }

  return (
    <motion.div className='h-full' variants={fadeOutRightVariants} {...variantProps}>
      <Show
        when={isNotEmpty(membersWithAmounts)}
        fallback={
          <IonText className='grid h-full place-items-center text-lg text-neutral-400'>
            Füge neue Mitglieder hinzu!
          </IonText>
        }
      >
        <div className='pb-20'>
          {membersWithAmounts.map((member, index) => {
            const memberInvolved = isMemberInvolved(member.id, purchases, incomes, compensations)
            return (
              <SlidingListItem
                key={member.id}
                label={member.name}
                endText={
                  <IonText color={cn({ success: isPositive(member.current), danger: isNegative(member.current) })}>
                    {displayCurrencyValue(member.current)}
                  </IonText>
                }
                onDelete={() => onDeleteMember(member.id, memberInvolved)}
                onSelect={() => onSelectMember(member)}
                icon={personSharp}
                labelComponent={<MemberInfo member={member} />}
                activeIcon={memberInvolved}
                lines={isLast(index, membersWithAmounts) ? 'none' : 'inset'}
              />
            )
          })}
        </div>
      </Show>
    </motion.div>
  )
}
