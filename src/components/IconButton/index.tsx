import { IonButton, IonIcon } from '@ionic/react'
import { MouseEventHandler } from 'react'
import './index.scss'

interface IconButtonProps {
  children: string
  icon: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLIonButtonElement>
  disabled?: boolean
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark'
  fill?: 'solid' | 'clear' | 'outline' | 'default'
  size?: 'small' | 'default' | 'large'
  className?: string
}

export const IconButton = ({
  children,
  icon,
  type = 'button',
  disabled = false,
  color = 'medium',
  fill = 'default',
  size = 'default',
  className = 'icon-button',
  onClick,
}: IconButtonProps): JSX.Element => (
  <IonButton
    expand='block'
    className={className}
    color={color}
    type={type}
    disabled={disabled}
    fill={fill}
    size={size}
    {...(onClick && { onClick })}
  >
    {children}
    <IonIcon slot='end' icon={icon} />
  </IonButton>
)
