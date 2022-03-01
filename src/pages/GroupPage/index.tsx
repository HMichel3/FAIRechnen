import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
  useIonModal,
} from '@ionic/react'
import { closeSharp, helpCircleSharp, moonSharp, peopleSharp, repeatSharp, sunnySharp } from 'ionicons/icons'
import { SlidingListItem } from '../../components/SlidingListItem'
import { IconButton } from '../../components/IconButton'
import { InfoSlides } from '../../components/InfoSlides'
import { useGroupPage } from './useGroupPage'
import { isLast } from '../../App/utils'
import { useState } from 'react'
import { GroupInfo } from './GroupInfo'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { AddGroupModal } from '../../components/AddGroupModal'
import { isDark } from './utils'

export const GroupPage = (): JSX.Element => {
  const {
    theme,
    showInfoSlides,
    showDeleteGroupAlert,
    selectedGroupId,
    setShowDeleteGroupAlert,
    onDeleteGroup,
    onToggleShowInfoSlides,
  } = useGroupPage()
  const groups = usePersistedStore.useGroups()
  const deleteGroup = usePersistedStore.useDeleteGroup()
  const setGroups = usePersistedStore.useSetGroups()
  const setTheme = usePersistedStore.useSetTheme()
  const [reorder, setReorder] = useState(false)
  const [showAddGroupModal, dismissAddGroupModal] = useIonModal(AddGroupModal, {
    onDismiss: () => dismissAddGroupModal(),
  })

  return (
    <>
      <IonMenu side='start' contentId='main-content' swipeGesture={!showInfoSlides}>
        <IonHeader>
          <IonToolbar color='dark'>
            <IonTitle>Optionen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem onClick={onToggleShowInfoSlides} lines='none'>
              <IonIcon className='list-item-icon-color' icon={helpCircleSharp} slot='start' />
              <IonLabel>Hilfe</IonLabel>
            </IonItem>
            <IonItem onClick={isDark(theme) ? () => setTheme('white') : () => setTheme('dark')} lines='none'>
              <IonIcon className='list-item-icon-color' slot='start' icon={isDark(theme) ? sunnySharp : moonSharp} />
              <IonLabel>{isDark(theme) ? 'Lightmode' : 'Darkmode'}</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id='main-content'>
        <IonHeader>
          <IonToolbar color='dark'>
            <IonButtons slot='start'>
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Gruppenübersicht</IonTitle>
            <IonButtons slot='end'>
              <IonButton onClick={() => setReorder(prevState => !prevState)}>
                <IonIcon slot='icon-only' icon={reorder ? closeSharp : repeatSharp} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonReorderGroup disabled={!reorder} onIonItemReorder={({ detail }) => setGroups(detail.complete(groups))}>
            {groups.map(group => (
              <SlidingListItem
                key={group.groupId}
                label={group.name}
                routerLink={`/groups/${group.groupId}`}
                onDelete={() => onDeleteGroup(group.groupId)}
                icon={peopleSharp}
                labelComponent={<GroupInfo groupId={group.groupId} />}
                reorder={reorder}
                transparentLine={isLast(group, groups)}
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
        </IonContent>
        <IonFooter>
          <IonToolbar color='dark'>
            <IconButton icon={peopleSharp} onClick={() => showAddGroupModal()}>
              Gruppe hinzufügen
            </IconButton>
          </IonToolbar>
        </IonFooter>
      </IonPage>
      {showInfoSlides && (
        <IonPage className='info-slides-container'>
          <IonContent>
            <InfoSlides onToggleShowInfoSlides={onToggleShowInfoSlides} />
          </IonContent>
        </IonPage>
      )}
    </>
  )
}
