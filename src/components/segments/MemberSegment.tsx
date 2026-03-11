import { personSharp } from 'ionicons/icons'
import { motion } from 'motion/react'
import { isEmpty } from 'remeda'
import { GroupData } from '../../hooks/useGroupData'
import { useOverlay } from '../../hooks/useOverlay'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { fadeOutRightVariants } from '../../utils/animation'
import { isLast, isMemberInvolved } from '../../utils/guard'
import { HintAlert } from '../alerts/HintAlert'
import { MemberInfo } from '../info/MemberInfo'
import { FullscreenText } from '../ui/FullscreenText'
import { SlidingListItem } from '../ui/SlidingListItem'

type MemberSegmentProps = {
  groupData: GroupData
}

export const MemberSegment = ({ groupData }: MemberSegmentProps) => {
  const deleteMember = usePersistedStore(s => s.deleteMember)
  const cantDeleteMemberOverlay = useOverlay()

  const onDeleteMember = (memberId: string, memberInvolved: boolean) => {
    if (memberInvolved) {
      cantDeleteMemberOverlay.onOpen()
      return
    }
    deleteMember(groupData.id, memberId)
  }

  if (isEmpty(groupData.membersWithAmounts)) {
    return <FullscreenText>Füge neue Mitglieder hinzu!</FullscreenText>
  }

  return (
    <motion.div className='h-full' {...fadeOutRightVariants}>
      <div className='pb-20'>
        {groupData.membersWithAmounts.map((member, index) => {
          const memberInvolved = isMemberInvolved(
            member.id,
            groupData.purchases,
            groupData.incomes,
            groupData.compensations
          )
          return (
            <SlidingListItem
              key={member.id}
              icon={personSharp}
              label={<MemberInfo member={member} />}
              routerLink={`/groups/${groupData.id}/member/${member.id}`}
              onDelete={() => onDeleteMember(member.id, memberInvolved)}
              isActive={memberInvolved}
              lines={isLast(index, groupData.membersWithAmounts) ? 'none' : 'inset'}
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
