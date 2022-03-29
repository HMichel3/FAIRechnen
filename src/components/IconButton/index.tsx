import { IonButton, IonIcon } from '@ionic/react'
import { MouseEventHandler } from 'react'
import './index.scss'

interface IconButtonProps {
  children: string
  icon: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLIonButtonElement>
  disabled?: boolean
}

export const IconButton = ({
  children,
  icon,
  onClick,
  type = 'button',
  disabled = false,
}: IconButtonProps): JSX.Element => (
  <IonButton
    className='icon-button'
    color='medium'
    expand='block'
    type={type}
    disabled={disabled}
    {...(onClick && { onClick })}
  >
    {children}
    <IonIcon slot='end' icon={icon} />
  </IonButton>
)
