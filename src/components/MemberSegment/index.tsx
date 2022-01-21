import { IonAlert } from '@ionic/react'
import { displayCurrencyValue, equalsLast } from '../../App/utils'
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
    displayMemberTotalAmount,
  } = useMemberSegment()

  return (
    <motion.div variants={fadeOutRightVariants} {...variantProps}>
      {groupMembers.map(member => (
        <SlidingListItem
          key={member.id}
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
          labelComponent={<SmallLabelComponent>{displayMemberTotalAmount(member.id)}</SmallLabelComponent>}
          lines={equalsLast(member, groupMembers) ? 'none' : undefined}
          style={{ marginBottom: equalsLast(member, groupMembers) ? 81 : 0 }}
        />
      ))}
      <IonAlert
        isOpen={showCantDeleteMemberAlert}
        onDidDismiss={() => setShowCantDeleteMemberAlert(false)}
        header='Mitglied kann nicht gelöscht werden!'
        message='Mitglieder mit offenen Rechnungen können nicht gelöscht werden. Bearbeiten Sie die vorhandenen Einkäufe oder Einkommen, beziehungsweise fügen Sie neue Zahlungen hinzu.'
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
