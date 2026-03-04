import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { ContactPageList } from '../components/pageLists/ContactPageList'

export const ContactPage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Kontakte</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ContactPageList />
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton routerLink='/contacts/add'>
            <IonIcon icon={addSharp} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}
