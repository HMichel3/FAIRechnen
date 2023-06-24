import { IonAlert } from '@ionic/react'
import { displayCurrencyValue, isLast, isNegative, isPositive } from '../../App/utils'
import { SlidingListItem } from '../SlidingListItem'
import { motion } from 'framer-motion'
import { variantProps, fadeOutRightVariants } from '../../App/animations'
import { personSharp } from 'ionicons/icons'
import { SmallLabelComponent } from '../SlidingListItem/SmallLabelComponent'
import clsx from 'clsx'
import { SimpleSaveAlert } from '../SimpleSaveAlert'
import { useRef, useState } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { isMemberInvolved } from './utils'
import { Show } from '../SolidComponents/Show'
import { isEmpty } from 'ramda'

export const MemberSegment = (): JSX.Element => {
  const { id: groupId, purchases, incomes, compensations, membersWithAmounts } = useStore(s => s.selectedGroup)
  const editMemberName = usePersistedStore(s => s.editMemberName)
  const deleteMember = usePersistedStore(s => s.deleteMember)
  const [showEditMemberAlert, setShowEditMemberAlert] = useState(false)
  const [showCantDeleteMemberAlert, setShowCantDeleteMemberAlert] = useState(false)
  const selectedMemberRef = useRef<Member>()

  const onSelectMember = (member: Member) => {
    selectedMemberRef.current = member
    setShowEditMemberAlert(true)
  }

  const onDeleteMember = (memberId: string) => {
    if (isMemberInvolved(memberId, purchases, incomes, compensations)) return setShowCantDeleteMemberAlert(true)
    deleteMember(groupId, memberId)
  }

  return (
    <>
      {/* height is needed for the no-items-info */}
      <motion.div style={{ height: '100%' }} variants={fadeOutRightVariants} {...variantProps}>
        <Show
          when={!isEmpty(membersWithAmounts)}
          fallback={<p className='no-items-info'>Füge neue Mitglieder hinzu!</p>}
        >
          <>
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
              />
            ))}
            {/* needed so that the list entries are not hidden under the FAB */}
            <div style={{ height: 90 }} onClick={() => {}} />
          </>
        </Show>
      </motion.div>
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
        onSave={newValue => editMemberName(groupId, selectedMemberRef.current!.id, newValue)}
        value={selectedMemberRef.current?.name}
      />
    </>
  )
}
