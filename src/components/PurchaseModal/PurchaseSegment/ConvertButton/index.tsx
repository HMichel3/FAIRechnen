import { IonButton, IonIcon } from '@ionic/react'
import { calculatorSharp } from 'ionicons/icons'

interface ConvertButtonProps {
  onClick: () => void
}

export const ConvertButton = ({ onClick }: ConvertButtonProps) => (
  <IonButton className='m-0' size='large' fill='clear' onClick={onClick}>
    <IonIcon slot='icon-only' icon={calculatorSharp} />
  </IonButton>
)
