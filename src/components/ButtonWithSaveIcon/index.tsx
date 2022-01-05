import { IonButton, IonIcon } from '@ionic/react'
import { saveSharp } from 'ionicons/icons'
import { MouseEventHandler } from 'react'

interface ButtonWithSaveIconProps {
  children: string
  onClick?: MouseEventHandler<HTMLIonButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  icon?: string
}

export const ButtonWithSaveIcon = ({
  children,
  onClick,
  type,
  disabled,
  icon = saveSharp,
}: ButtonWithSaveIconProps): JSX.Element => (
  <IonButton
    className='ion-margin-horizontal ion-margin-top'
    style={{ marginBottom: 24 }}
    color='medium'
    expand='block'
    {...(onClick && { onClick })}
    {...(type && { type })}
    {...(disabled && { disabled })}
  >
    {children}
    <IonIcon slot='end' icon={icon} />
  </IonButton>
)
