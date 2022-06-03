import { IonAlert } from '@ionic/react'
import { calculateMembersWithAmounts, displayCurrencyValue, isLast, isNegative, isPositive } from '../../App/utils'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { variantProps, fadeOutRightVariants } from '../../App/animations'
import { personSharp } from 'ionicons/icons'
import { SmallLabelComponent } from '../SlidingListItem/SmallLabelComponent'
import clsx from 'clsx'
import { SimpleSaveAlert } from '../SimpleSaveAlert'
import { useState } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { Member } from '../../stores/types'
import { isMemberInvolved } from './utils'

export const MemberSegment = (): JSX.Element => {
  const { id: groupId, members, purchases, incomes, compensations } = useStore(s => s.selectedGroup)
  const editMemberName = usePersistedStore(s => s.editMemberName)
  const deleteMember = usePersistedStore(s => s.deleteMember)
  const [selectedMember, setSelectedMember] = useState<Member>()
  const [showEditMemberAlert, setShowEditMemberAlert] = useState(false)
  const [showCantDeleteMemberAlert, setShowCantDeleteMemberAlert] = useState(false)
  const membersWithAmounts = calculateMembersWithAmounts(members, purchases, incomes, compensations)

  const onSelectMember = (member: Member) => {
    setSelectedMember(member)
    setShowEditMemberAlert(true)
  }

  const onDeleteMember = (memberId: string) => {
    if (isMemberInvolved(memberId, purchases, incomes, compensations)) return setShowCantDeleteMemberAlert(true)
    deleteMember(groupId, memberId)
  }

  return (
    <motion.div variants={fadeOutRightVariants} {...variantProps}>
      {membersWithAmounts.map(member => (
        <SlidingListItem
          key={member.id}
          label={member.name}
          endText={
            <div
              className={clsx({
                'color-success': isPositive(member.current),
                'color-danger': isNegative(member.current),
              })}
            >
              {displayCurrencyValue(member.current)}
            </div>
          }
          onDelete={() => onDeleteMember(member.id)}
          onSelect={() => onSelectMember(member)}
          icon={personSharp}
          labelComponent={<SmallLabelComponent>{displayCurrencyValue(member.total)}</SmallLabelComponent>}
          transparentLine={isLast(member, membersWithAmounts)}
          style={{ marginBottom: isLast(member, membersWithAmounts) ? 80 : 0 }}
        />
      ))}
      <IonAlert
        isOpen={showCantDeleteMemberAlert}
        onDidDismiss={() => setShowCantDeleteMemberAlert(false)}
        header='Mitglied kann nicht gelöscht werden!'
        message='Mitglieder, welche an Einkäufen, Einkommen oder Zahlungen beteiligt sind, können nicht gelöscht werden. Bearbeiten Sie erst die betroffenen Einträge.'
        buttons={[{ role: 'cancel', text: 'Okay' }]}
      />
      <SimpleSaveAlert
        isOpen={showEditMemberAlert}
        header='Mitglied umbenennen'
        setIsOpen={setShowEditMemberAlert}
        onSave={newValue => editMemberName(groupId, selectedMember!.id, newValue)}
        value={selectedMember?.name}
      />
    </motion.div>
  )
}
