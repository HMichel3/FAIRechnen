import { IonAlert } from '@ionic/react'

type HintAlertProps = {
  overlay: { isOpen: boolean; onDidDismiss: () => void }
  header: string
  message: string
}

export const HintAlert = ({ overlay, header, message }: HintAlertProps) => {
  return (
    <IonAlert
      isOpen={overlay.isOpen}
      onDidDismiss={overlay.onDidDismiss}
      header={header}
      message={message}
      buttons={[{ role: 'confirm', text: 'Ok' }]}
    />
  )
}
