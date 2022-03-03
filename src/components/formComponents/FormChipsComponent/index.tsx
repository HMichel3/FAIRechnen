import { IonLabel } from '@ionic/react'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { FieldError } from 'react-hook-form'
import './index.scss'

interface FormChipsComponentProps {
  label: string
  children: ReactNode
  error?: FieldError
}

export const FormChipsComponent = ({ label, children, error }: FormChipsComponentProps) => (
  <div className={clsx('form-input-margin form-chips-component', { 'error-border': error })}>
    <IonLabel color='light' position='stacked' style={{ marginLeft: 16 }}>
      {label}
    </IonLabel>
    {children}
  </div>
)
