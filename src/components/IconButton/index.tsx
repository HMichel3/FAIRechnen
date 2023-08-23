import { IonButton, IonIcon } from '@ionic/react'
import { MouseEventHandler } from 'react'
import { cn } from '../../App/utils'

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
  color,
  fill = 'default',
  size = 'default',
  className,
  onClick,
}: IconButtonProps): JSX.Element => (
  <IonButton
    className={cn('m-0', className)}
    expand='block'
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
