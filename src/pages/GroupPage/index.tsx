import { IonAlert, IonReorderGroup, useIonModal } from '@ionic/react'
import { closeSharp, helpCircleSharp, peopleSharp, repeatSharp } from 'ionicons/icons'
import { SlidingListItem } from '../../components/SlidingListItem'
import { PageLayout } from '../../components/PageLayout'
import { PageContent } from '../../components/PageLayout/PageContent'
import { PageFooter } from '../../components/PageLayout/PageFooter'
import { PageHeader } from '../../components/PageLayout/PageHeader'
import { ButtonWithSaveIcon } from '../../components/ButtonWithSaveIcon'
import { InfoSlides } from '../../components/InfoSlides'
import { useGroupPage } from './useGroupPage'
import { equalsLast } from '../../App/utils'
import { useState } from 'react'
import { GroupTotalComponent } from './GroupTotalComponent'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { AddGroupModal } from '../../components/AddGroupModal'

export const GroupPage = (): JSX.Element => {
  const {
    showInfoSlides,
    showDeleteGroupAlert,
    selectedGroupId,
    setShowDeleteGroupAlert,
    onDeleteGroup,
    onToggleDarkMode,
    onToggleShowInfoSlides,
  } = useGroupPage()
  const groups = usePersistedStore.useGroups()
  const deleteGroup = usePersistedStore.useDeleteGroup()
  const setGroups = usePersistedStore.useSetGroups()
  const [reorder, setReorder] = useState(false)
  const [showAddGroupModal, dismissAddGroupModal] = useIonModal(AddGroupModal, {
    onDismiss: () => dismissAddGroupModal(),
  })

  if (showInfoSlides) {
    return (
      <PageLayout>
        <PageContent>
          <InfoSlides onToggleShowInfoSlides={onToggleShowInfoSlides} />
        </PageContent>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title='Gruppen'
        onToggleDarkMode={onToggleDarkMode}
        menuButtons={[
          { icon: reorder ? closeSharp : repeatSharp, onClick: () => setReorder(prevState => !prevState) },
          { icon: helpCircleSharp, onClick: onToggleShowInfoSlides },
        ]}
      />
      <PageContent>
        <IonReorderGroup disabled={!reorder} onIonItemReorder={({ detail }) => setGroups(detail.complete(groups))}>
          {groups.map(group => (
            <SlidingListItem
              key={group.groupId}
              label={group.name}
              routerLink={`/groups/${group.groupId}`}
              onDelete={() => onDeleteGroup(group.groupId)}
              icon={peopleSharp}
              labelComponent={<GroupTotalComponent groupId={group.groupId} />}
              lines={equalsLast(group, groups) ? 'none' : undefined}
              reorder={reorder}
            />
          ))}
        </IonReorderGroup>
        <IonAlert
          cssClass='delete-alert'
          isOpen={showDeleteGroupAlert}
          onDidDismiss={() => setShowDeleteGroupAlert(false)}
          header='Wollen Sie die Gruppe wirklich löschen?'
          message='Mit dem Löschen der Gruppe gehen sämtliche Informationen bezüglich der Mitglieder, der Einkäufe sowie möglicher offener Rechnungen verloren!'
          buttons={[
            { role: 'cancel', text: 'Abbrechen' },
            { text: 'Löschen', handler: () => deleteGroup(selectedGroupId) },
          ]}
        />
      </PageContent>
      <PageFooter>
        <ButtonWithSaveIcon icon={peopleSharp} onClick={() => showAddGroupModal()}>
          Gruppe hinzufügen
        </ButtonWithSaveIcon>
      </PageFooter>
    </PageLayout>
  )
}
