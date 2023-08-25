import { IonButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react'

interface ModalHeaderProps {
  title: string
  onDismiss: () => void
  children?: JSX.Element
}

export const ModalHeader = ({ title, onDismiss, children }: ModalHeaderProps): JSX.Element => (
  <IonHeader>
    <IonToolbar>
      <IonTitle>{title}</IonTitle>
      <IonButtons slot='end'>
        <IonButton color='danger' onClick={onDismiss}>
          Abbrechen
        </IonButton>
      </IonButtons>
    </IonToolbar>
    {children}
  </IonHeader>
)
