import { IonButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import { PropsWithChildren } from 'react'

type PageHeaderProps = PropsWithChildren<{
  title: string
  onDismiss: () => void
}>

export const PageHeader = ({ title, onDismiss, children }: PageHeaderProps) => (
  <IonHeader>
    <IonToolbar>
      <IonTitle>{title}</IonTitle>
      <IonButtons slot='end'>
        <IonButton onClick={onDismiss}>Abbrechen</IonButton>
      </IonButtons>
    </IonToolbar>
    {children}
  </IonHeader>
)
