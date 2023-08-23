import { IonText, useIonAlert } from '@ionic/react'
import { cn, displayCurrencyValue, isNegative, isPositive } from '../../App/utils'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { variantProps, fadeOutRightVariants } from '../../App/animations'
import { personSharp } from 'ionicons/icons'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { isMemberInvolved } from './utils'
import { Show } from '../SolidComponents/Show'
import { isEmpty, trim } from 'ramda'
import { Member } from '../../stores/types'

export const MemberSegment = (): JSX.Element => {
  const { id: groupId, purchases, incomes, compensations, membersWithAmounts } = useStore(s => s.selectedGroup)
  const editMemberName = usePersistedStore(s => s.editMemberName)
  const deleteMember = usePersistedStore(s => s.deleteMember)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const [presentCantDeleteMember] = useIonAlert()
  const [presentEditMember] = useIonAlert()

  const onSelectMember = (member: Member) => {
    presentEditMember({
      header: 'Mitglied umbenennen',
      inputs: [{ name: 'memberName', value: member.name }],
      buttons: [
        { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
        {
          role: 'confirm',
          text: 'Speichern',
          handler: ({ memberName }) => {
            editMemberName(groupId, member.id, trim(memberName))
            setShowAnimation()
          },
        },
      ],
    })
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
        when={!isEmpty(membersWithAmounts)}
        fallback={
          <IonText className='grid h-full place-items-center text-lg text-neutral-400'>
            Füge neue Mitglieder hinzu!
          </IonText>
        }
      >
        <div className='pb-20'>
          {membersWithAmounts.map(member => {
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
                labelComponent={
                  <IonText className='text-sm text-neutral-400'>{displayCurrencyValue(member.total)}</IonText>
                }
                activeIcon={memberInvolved}
              />
            )
          })}
        </div>
      </Show>
    </motion.div>
  )
}
