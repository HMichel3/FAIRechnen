import { IonButton, IonIcon, IonItem, IonLabel, IonNote } from '@ionic/react'
import { closeSharp } from 'ionicons/icons'
import { ReactNode } from 'react'
import { FieldError } from 'react-hook-form'
import './index.css'

interface FormComponentProps {
  label: string
  error?: FieldError
  onDelete?: () => void
  children: ReactNode
  lines: 'full' | 'inset' | 'none'
}

export const FormComponent = ({ label, error, onDelete, children, lines }: FormComponentProps): JSX.Element => (
  <IonItem className='relative-ion-item item-border-color' lines={lines}>
    <IonLabel className='item-label-color' position='stacked'>
      {label}
    </IonLabel>
    {error && (
      <IonNote className='error-ion-note' color='danger' slot='end'>
        {error.message}
      </IonNote>
    )}
    {!error && onDelete && (
      <IonButton className='delete-ion-button' slot='end' color='danger' fill='clear' onClick={onDelete}>
        <IonIcon slot='icon-only' icon={closeSharp} />
      </IonButton>
    )}
    {children}
  </IonItem>
)
