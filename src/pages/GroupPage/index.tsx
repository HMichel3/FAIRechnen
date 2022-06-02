import {
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
  IonTitle,
  IonToolbar,
  useIonModal,
} from '@ionic/react'
import { closeSharp, helpCircleSharp, moonSharp, peopleSharp, repeatSharp, sunnySharp } from 'ionicons/icons'
import { IconButton } from '../../components/IconButton'
import { InfoSlides } from '../../components/InfoSlides'
import { useGroupPage } from './useGroupPage'
import { useState } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { AddGroupModal } from '../../components/AddGroupModal'
import { isDark } from './utils'
import { Show } from '../../components/SolidComponents/Show'
import { GroupPageList } from '../../components/GroupPageList'
import './index.scss'

export const GroupPage = (): JSX.Element => {
  const { theme, showInfoSlides, setShowInfoSlides, showFirstInfoSlides, onHideFirstInfoSlides, pageRef } =
    useGroupPage()
  const groups = usePersistedStore.useGroups()
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
            <IonItem onClick={() => setShowInfoSlides(true)} lines='none'>
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
      <IonPage id='main-content' ref={pageRef}>
        <IonHeader>
          <IonToolbar color='dark'>
            <IonButtons slot='start'>
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Gruppenübersicht</IonTitle>
            <IonButtons slot='end'>
              <IonButton disabled={groups.length < 2} onClick={() => setReorder(prevState => !prevState)}>
                <IonIcon slot='icon-only' icon={reorder ? closeSharp : repeatSharp} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <GroupPageList reorder={reorder} />
        </IonContent>
        <IonFooter>
          <IonToolbar color='dark'>
            <IconButton icon={peopleSharp} onClick={() => showAddGroupModal()}>
              Gruppe hinzufügen
            </IconButton>
          </IonToolbar>
        </IonFooter>
      </IonPage>
      <Show when={showInfoSlides}>
        <IonPage className='info-slides-container'>
          <IonContent>
            <InfoSlides onToggleShowInfoSlides={() => setShowInfoSlides(false)} />
          </IonContent>
        </IonPage>
      </Show>
      <Show when={showFirstInfoSlides}>
        <IonPage className='info-slides-container'>
          <IonContent>
            <InfoSlides onToggleShowInfoSlides={onHideFirstInfoSlides} />
          </IonContent>
        </IonPage>
      </Show>
    </>
  )
}
