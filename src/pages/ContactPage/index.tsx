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
  IonToast,
  IonToolbar,
  useIonAlert,
} from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { trim } from 'ramda'
import { useState } from 'react'
import { ContactPageList } from '../../components/ContactPageList'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

export const ContactPage = (): JSX.Element => {
  const addContact = usePersistedStore(s => s.addContact)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const [presentAddContact] = useIonAlert()
  const [isToastOpen, setIsToastOpen] = useState(false)

  const onAddContact = () => {
    presentAddContact({
      header: 'Kontakt hinzufügen',
      inputs: [
        { name: 'contactName', placeholder: 'Name eingeben' },
        { name: 'payPalMe', placeholder: 'PayPal.Me eingeben' },
      ],
      buttons: [
        { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
        {
          role: 'confirm',
          text: 'Speichern',
          handler: ({ contactName, payPalMe }) => {
            const newContact = { name: trim(contactName), payPalMe: trim(payPalMe) }
            const result = addContact(newContact)
            if (!result.success) {
              setIsToastOpen(true)
              return false
            }
            setShowAnimation()
          },
        },
      ],
    })
  }

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
          <IonFabButton onClick={onAddContact}>
            <IonIcon icon={addSharp} />
          </IonFabButton>
        </IonFab>
        <IonToast
          isOpen={isToastOpen}
          message='Dieser Kontakt existiert bereits!'
          onDidDismiss={() => setIsToastOpen(false)}
          duration={5000}
          color='danger'
        />
      </IonContent>
    </IonPage>
  )
}
