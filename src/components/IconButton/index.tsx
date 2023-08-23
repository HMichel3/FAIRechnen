import { IonButton, IonIcon } from '@ionic/react'
import { MouseEventHandler } from 'react'
import { cn } from '../../App/utils'

interface IconButtonProps {
  children: string
  icon: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLIonButtonElement>
  disabled?: boolean
  className?: string
}

export const IconButton = ({
  children,
  icon,
  type = 'button',
  disabled = false,
  className,
  onClick,
}: IconButtonProps): JSX.Element => (
  <IonButton
    className={cn('m-0', className)}
    expand='block'
    type={type}
    disabled={disabled}
    fill='clear'
    {...(onClick && { onClick })}
  >
    {children}
    <IonIcon slot='end' icon={icon} />
  </IonButton>
)
