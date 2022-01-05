import { IonLabel } from '@ionic/react'
import { ReactNode } from 'react'

interface SmallLabelComponentProps {
  children: ReactNode
}

export const SmallLabelComponent = ({ children }: SmallLabelComponentProps): JSX.Element => (
  <div className='small-label-component'>
    <IonLabel>{children}</IonLabel>
  </div>
)
