import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { helpCircleSharp } from 'ionicons/icons'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { InfoSlides } from '../others/InfoSlides'

export const SideMenu = () => {
  const isInfoSlideOpen = usePersistedStore(s => s.isInfoSlideOpen)
  const openInfoSlides = usePersistedStore(s => s.openInfoSlides)
  const closeInfoSlides = usePersistedStore(s => s.closeInfoSlides)

  return (
    <>
      <IonMenu side='start' menuId='side-menu' contentId='main-content' swipeGesture={false}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Optionen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem onClick={openInfoSlides} lines='none' button>
                <IonIcon icon={helpCircleSharp} slot='start' />
                <IonLabel>Hilfe</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonModal isOpen={isInfoSlideOpen} onDidDismiss={closeInfoSlides}>
        <InfoSlides onDismiss={closeInfoSlides} />
      </IonModal>
    </>
  )
}
