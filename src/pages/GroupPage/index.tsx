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
import { IconButton } from '../../components/IconButton'
import { InfoSlides } from '../../components/InfoSlides'
import { useEffect, useRef, useState } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { AddGroupModal } from '../../components/AddGroupModal'
import { Show } from '../../components/SolidComponents/Show'
import { GroupPageList } from '../../components/GroupPageList'
import { SuccessAnimation } from '../../lotties/SuccessAnimation'
import { useStore } from '../../stores/useStore'
import { App } from '@capacitor/app'

export const GroupPage = (): JSX.Element => {
  const groups = usePersistedStore(s => s.groups)
  const alreadyVisited = usePersistedStore(s => s.alreadyVisited)
  const setAlreadyVisited = usePersistedStore(s => s.setAlreadyVisited)
  const showAnimation = useStore(s => s.showAnimation)
  const [reorder, setReorder] = useState(false)
  const [showInfoSlides, setShowInfoSlides] = useState(false)
  const [showFirstInfoSlides, setShowFirstInfoSlides] = useState(!alreadyVisited)
  const ionRouter = useIonRouter()
  const [showAddGroupModal, dismissAddGroupModal] = useIonModal(AddGroupModal, {
    onDismiss: () => dismissAddGroupModal(),
  })
  // needed to remove the ion-page-invisible to show the page after the firstInfoSlide is closed
  const pageRef = useRef(null)

  useEffect(() => {
    document.addEventListener('ionBackButton', event => {
      // @ts-ignore
      event.detail.register(-1, () => {
        if (showInfoSlides) return setShowInfoSlides(false)
        if (showFirstInfoSlides) return onHideFirstInfoSlides()
        if (!ionRouter.canGoBack()) App.exitApp()
      })
    })
  }, [ionRouter, showInfoSlides, showFirstInfoSlides])

  useEffect(() => {
    document.body.classList.add('dark')
  }, [])

  useEffect(() => {
    setAlreadyVisited()
  }, [setAlreadyVisited])

  const onHideFirstInfoSlides = () => {
    setShowFirstInfoSlides(false)
    // @ts-ignore typing on pageRef is not correct from ionic
    pageRef.current?.classList.remove('ion-page-invisible')
  }

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
      <IonPage id='main-content' ref={pageRef}>
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
        <InfoSlides onToggleShowInfoSlides={() => setShowInfoSlides(false)} />
      </Show>
      <Show when={showFirstInfoSlides}>
        <InfoSlides onToggleShowInfoSlides={onHideFirstInfoSlides} />
      </Show>
    </>
  )
}
