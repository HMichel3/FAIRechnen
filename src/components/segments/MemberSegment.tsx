import { personSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { isEmptyish } from 'remeda'
import { useOverlay } from '../../hooks/useOverlay'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { fadeOutRightVariants } from '../../utils/animation'
import { isLast } from '../../utils/common'
import { isMemberInvolved } from '../../utils/member'
import { HintAlert } from '../alerts/HintAlert'
import { MemberInfo } from '../info/MemberInfo'
import { FullscreenText } from '../ui/FullscreenText'
import { SlidingListItem } from '../ui/SlidingListItem'

export const MemberSegment = () => {
  const { id: groupId, purchases, incomes, compensations, membersWithAmounts } = useStore(s => s.selectedGroup)
  const deleteMember = usePersistedStore(s => s.deleteMember)
  const cantDeleteMemberOverlay = useOverlay()

  const onDeleteMember = (memberId: string, memberInvolved: boolean) => {
    if (memberInvolved) {
      cantDeleteMemberOverlay.onOpen()
      return
    }
    deleteMember(groupId, memberId)
  }

  if (isEmptyish(membersWithAmounts)) {
    return <FullscreenText>Füge neue Mitglieder hinzu!</FullscreenText>
  }

  return (
    <motion.div className='h-full' {...fadeOutRightVariants}>
      <div className='pb-20'>
        {membersWithAmounts.map((member, index) => {
          const memberInvolved = isMemberInvolved(member.id, purchases, incomes, compensations)
          return (
            <SlidingListItem
              key={member.id}
              icon={personSharp}
              label={<MemberInfo member={member} />}
              routerLink={`/groups/${groupId}/member/${member.id}`}
              onDelete={() => onDeleteMember(member.id, memberInvolved)}
              isActive={memberInvolved}
              lines={isLast(index, membersWithAmounts) ? 'none' : 'inset'}
            />
          )
        })}
      </div>
      <HintAlert
        overlay={cantDeleteMemberOverlay}
        header='Löschen nicht möglich'
        message='Dieses Mitglied ist noch mit Einkäufen, Einkommen oder Zahlungen verknüpft. Bitte bearbeite oder entferne diese zuerst.'
      />
    </motion.div>
  )
}
