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
import { closeSharp, helpCircleSharp, moonSharp, peopleSharp, repeatSharp, sunnySharp } from 'ionicons/icons'
import { IconButton } from '../../components/IconButton'
import { InfoSlides } from '../../components/InfoSlides'
import { useEffect, useRef, useState } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { AddGroupModal } from '../../components/AddGroupModal'
import { isDark } from './utils'
import { Show } from '../../components/SolidComponents/Show'
import { GroupPageList } from '../../components/GroupPageList'
import { SuccessAnimation } from '../../lotties/SuccessAnimation'
import { useStore } from '../../stores/useStore'
import { App } from '@capacitor/app'
import './index.scss'

export const GroupPage = (): JSX.Element => {
  const groups = usePersistedStore(s => s.groups)
  const setTheme = usePersistedStore(s => s.setTheme)
  const theme = usePersistedStore(s => s.theme)
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
    if (isDark(theme)) return document.body.classList.add('dark')
    document.body.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    setAlreadyVisited()
  }, [setAlreadyVisited])

  const onHideFirstInfoSlides = () => {
    setShowFirstInfoSlides(false)
    // @ts-ignore typing on pageRef is not correct from ionic
    pageRef.current?.classList.remove('ion-page-invisible')
  }

  return (
    <div className='group-page'>
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
        <Show when={showAnimation}>
          <SuccessAnimation />
        </Show>
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
    </div>
  )
}
