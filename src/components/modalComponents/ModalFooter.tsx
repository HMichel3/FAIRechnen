import { IonFooter, IonToolbar } from '@ionic/react'
import { saveSharp } from 'ionicons/icons'
import { IconButton } from '../IconButton'

type ModalFooterProps = {
  children: string
}

export const ModalFooter = ({ children }: ModalFooterProps): JSX.Element => (
  <IonFooter>
    <IonToolbar>
      <IconButton type='submit' icon={saveSharp}>
        {children}
      </IconButton>
    </IonToolbar>
  </IonFooter>
)
