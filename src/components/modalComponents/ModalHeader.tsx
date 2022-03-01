import { IonButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react'

interface ModalHeaderProps {
  children: string
  onDismiss: () => void
}

export const ModalHeader = ({ children, onDismiss }: ModalHeaderProps): JSX.Element => (
  <IonHeader>
    <IonToolbar color='dark'>
      <IonTitle className='ion-padding-horizontal'>{children}</IonTitle>
      <IonButtons slot='end'>
        <IonButton color='danger' onClick={onDismiss}>
          Abbrechen
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
)
