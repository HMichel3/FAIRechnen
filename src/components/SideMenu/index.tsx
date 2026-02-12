import { App } from '@capacitor/app'
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import { helpCircleSharp } from 'ionicons/icons'
import { useEffect } from 'react'
import { InfoSlides } from '../../components/InfoSlides'
import { Show } from '../../components/SolidComponents/Show'
import { usePersistedStore } from '../../stores/usePersistedStore'

export const SideMenu = (): JSX.Element => {
  const showInfoSlides = usePersistedStore(s => s.showInfoSlides)
  const setShowInfoSlides = usePersistedStore(s => s.setShowInfoSlides)
  const ionRouter = useIonRouter()

  useEffect(() => {
    const handleBackButton = (event: Event) => {
      // @ts-expect-error event.detail is not defined in the type definition
      event.detail.register(-1, () => {
        if (showInfoSlides) {
          setShowInfoSlides(false)
          return
        }
        if (!ionRouter.canGoBack()) {
          App.exitApp()
        }
      })
    }
    document.addEventListener('ionBackButton', handleBackButton)
    return () => {
      document.removeEventListener('ionBackButton', handleBackButton)
    }
  }, [ionRouter, showInfoSlides, setShowInfoSlides])

  return (
    <>
      <IonMenu
        side='start'
        menuId='side-menu'
        contentId='main-content'
        swipeGesture={!showInfoSlides}
        maxEdgeStart={-1}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Optionen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem onClick={() => setShowInfoSlides(true)} lines='none' button>
                <IonIcon icon={helpCircleSharp} slot='start' />
                <IonLabel>Hilfe</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
      <Show when={showInfoSlides}>
        <InfoSlides onHideShowInfoSlides={() => setShowInfoSlides(false)} />
      </Show>
    </>
  )
}
