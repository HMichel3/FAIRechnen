import { IonAlert } from '@ionic/react'
import { isNonNull } from 'remeda'

type DeleteAlertProps<T extends string | number> = {
  overlay: { isOpen: boolean; onDidDismiss: () => void; selected: { id: T; name: string } | null }
  onDelete: (id: T) => void
  message: string
}

export const DeleteAlert = <T extends string | number>({ overlay, onDelete, message }: DeleteAlertProps<T>) => {
  return (
    <IonAlert
      cssClass='custom-alert'
      isOpen={overlay.isOpen}
      onDidDismiss={overlay.onDidDismiss}
      header={`„${overlay.selected?.name}“ löschen?`}
      message={message}
      buttons={[
        { role: 'cancel', text: 'Abbrechen' },
        {
          role: 'confirm',
          text: 'Löschen',
          cssClass: 'alert-button-danger',
          handler: () => {
            if (isNonNull(overlay.selected)) {
              onDelete(overlay.selected.id)
            }
          },
        },
      ]}
    />
  )
}
