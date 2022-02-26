import { IonAlert } from '@ionic/react'
import { displayCurrencyValue, isLast } from '../../App/utils'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { variantProps, fadeOutRightVariants } from '../../App/animations'
import { personSharp } from 'ionicons/icons'
import { SmallLabelComponent } from '../SlidingListItem/SmallLabelComponent'
import clsx from 'clsx'
import { isNegative, isPositive } from 'ramda-adjunct'
import { useMemberSegment } from './useMemberSegment'
import { SimpleSaveAlert } from '../SimpleSaveAlert'

export const MemberSegment = (): JSX.Element => {
  const {
    groupMembers,
    selectedMember,
    showEditMemberAlert,
    setShowEditMemberAlert,
    showCantDeleteMemberAlert,
    setShowCantDeleteMemberAlert,
    onEditMemberName,
    onDeleteMember,
    onSelectMember,
  } = useMemberSegment()

  return (
    <motion.div variants={fadeOutRightVariants} {...variantProps}>
      {groupMembers.map(member => (
        <SlidingListItem
          key={member.memberId}
          label={member.name}
          endText={
            <div
              className={clsx({
                'color-success': isPositive(member.amount),
                'color-danger': isNegative(member.amount),
              })}
            >
              {displayCurrencyValue(member.amount)}
            </div>
          }
          onDelete={() => onDeleteMember(member)}
          onSelect={() => onSelectMember(member)}
          icon={personSharp}
          labelComponent={<SmallLabelComponent>{displayCurrencyValue(member.totalAmount)}</SmallLabelComponent>}
          transparentLine={isLast(member, groupMembers)}
          style={{ marginBottom: isLast(member, groupMembers) ? 80 : 0 }}
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
        onSave={onEditMemberName}
        value={selectedMember?.name}
      />
    </motion.div>
  )
}
