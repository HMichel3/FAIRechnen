import { IonButton, IonIcon } from '@ionic/react'
import { calculatorSharp } from 'ionicons/icons'
import './index.scss'

interface ConvertButtonProps {
  onClick: () => void
}

export const ConvertButton = ({ onClick }: ConvertButtonProps) => (
  <IonButton className='convert-button' fill='outline' size='large' onClick={onClick}>
    <IonIcon slot='icon-only' color='light' icon={calculatorSharp} />
  </IonButton>
)
