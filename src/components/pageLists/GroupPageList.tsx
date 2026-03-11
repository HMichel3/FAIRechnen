import { IonReorderGroup } from '@ionic/react'
import { peopleSharp } from 'ionicons/icons'
import { hasAtLeast, isEmpty } from 'remeda'
import { useOverlay } from '../../hooks/useOverlay'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { Group } from '../../types/store'
import { determineLines } from '../../utils/display'
import { isGroupActive } from '../../utils/guard'
import { DeleteAlert } from '../alerts/DeleteAlert'
import { GroupInfo } from '../info/GroupInfo'
import { ArchivedGroups } from '../others/ArchivedGroups'
import { FullscreenText } from '../ui/FullscreenText'
import { SlidingListItem } from '../ui/SlidingListItem'

type GroupPageListProps = {
  reorder: boolean
}

export const GroupPageList = ({ reorder }: GroupPageListProps) => {
  const groups = usePersistedStore(s => s.groups)
  const groupArchive = usePersistedStore(s => s.groupArchive)
  const setGroups = usePersistedStore(s => s.setGroups)
  const deleteGroup = usePersistedStore(s => s.deleteGroup)
  const archiveGroup = usePersistedStore(s => s.archiveGroup)
  const deleteGroupOverlay = useOverlay<Group>()

  if (isEmpty(groups) && isEmpty(groupArchive)) {
    return <FullscreenText>Füge neue Gruppen hinzu!</FullscreenText>
  }

  return (
    <>
      <div className='pb-20'>
        {hasAtLeast(groups, 1) && (
          <IonReorderGroup
            disabled={!reorder}
            onIonReorderEnd={({ detail }) => {
              // needed to prevent an error while reordering restored groups
              const reorderedGroups = detail.complete([...groups])
              setGroups(reorderedGroups)
            }}
          >
            {groups.map((group, index) => (
              <SlidingListItem
                key={group.id}
                icon={peopleSharp}
                label={<GroupInfo groupId={group.id} />}
                routerLink={`/groups/${group.id}`}
                onDelete={() => deleteGroupOverlay.onSelect(group)}
                onArchive={() => archiveGroup(group.id)}
                reorder={reorder}
                isActive={isGroupActive(group)}
                lines={determineLines(index, groups, groupArchive)}
                detail
              />
            ))}
          </IonReorderGroup>
        )}
        {hasAtLeast(groupArchive, 1) && <ArchivedGroups groupArchive={groupArchive} />}
      </div>
      <DeleteAlert
        overlay={deleteGroupOverlay}
        onDelete={deleteGroup}
        message='Alle Mitglieder, Einkäufe, Einkommen und Zahlungen dieser Gruppe werden unwiderruflich entfernt.'
      />
    </>
  )
}
