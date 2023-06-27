import { IonButton, IonIcon } from '@ionic/react'
import { calculatorSharp } from 'ionicons/icons'
import clsx from 'clsx'
import './index.scss'

interface ConvertButtonProps {
  onClick: () => void
  smallLeft?: boolean
}

export const ConvertButton = ({ onClick, smallLeft = false }: ConvertButtonProps) => (
  <IonButton
    className={clsx('convert-button', { 'small-left': smallLeft })}
    fill='outline'
    size='large'
    onClick={onClick}
  >
    <IonIcon slot='icon-only' color='light' icon={calculatorSharp} />
  </IonButton>
)
