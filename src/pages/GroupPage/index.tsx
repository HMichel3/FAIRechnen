import { App } from '@capacitor/app'
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
  useIonRouter,
} from '@ionic/react'
import { closeSharp, helpCircleSharp, peopleSharp, repeatSharp } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { AddGroupModal } from '../../components/AddGroupModal'
import { GroupPageList } from '../../components/GroupPageList'
import { IconButton } from '../../components/IconButton'
import { InfoSlides } from '../../components/InfoSlides'
import { Show } from '../../components/SolidComponents/Show'
import { SuccessAnimation } from '../../lotties/SuccessAnimation'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

export const GroupPage = (): JSX.Element => {
  const groups = usePersistedStore(s => s.groups)
  const showInfoSlides = usePersistedStore(s => s.showInfoSlides)
  const setShowInfoSlides = usePersistedStore(s => s.setShowInfoSlides)
  const showAnimation = useStore(s => s.showAnimation)
  const [reorder, setReorder] = useState(false)
  const ionRouter = useIonRouter()
  const [showAddGroupModal, dismissAddGroupModal] = useIonModal(AddGroupModal, {
    onDismiss: () => dismissAddGroupModal(),
  })

  useEffect(() => {
    document.addEventListener('ionBackButton', event => {
      // @ts-expect-error event.detail is not defined in the type definition
      event.detail.register(-1, () => {
        if (showInfoSlides) return setShowInfoSlides(false)
        if (!ionRouter.canGoBack()) App.exitApp()
      })
    })
  }, [ionRouter, showInfoSlides, setShowInfoSlides])

  return (
    <>
      <IonMenu side='start' contentId='main-content' swipeGesture={!showInfoSlides}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Optionen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem onClick={() => setShowInfoSlides(true)} lines='none'>
              <IonIcon icon={helpCircleSharp} slot='start' />
              <IonLabel>Hilfe</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id='main-content'>
        <IonHeader>
          <IonToolbar>
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
          <IonToolbar>
            <IconButton icon={peopleSharp} onClick={() => showAddGroupModal()}>
              Gruppe hinzufügen
            </IconButton>
          </IonToolbar>
        </IonFooter>
        <Show when={showAnimation}>
          <SuccessAnimation />
        </Show>
      </IonPage>
      <Show when={showInfoSlides}>
        <InfoSlides onHideShowInfoSlides={() => setShowInfoSlides(false)} />
      </Show>
    </>
  )
}
