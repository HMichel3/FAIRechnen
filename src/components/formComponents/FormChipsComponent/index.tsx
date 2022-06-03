import { IonLabel } from '@ionic/react'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { FieldError } from 'react-hook-form'
import { isDark } from '../../../pages/GroupPage/utils'
import { usePersistedStore } from '../../../stores/usePersistedStore'
import './index.scss'

interface FormChipsComponentProps {
  label: string
  children: ReactNode
  error?: FieldError
}

export const FormChipsComponent = ({ label, children, error }: FormChipsComponentProps) => {
  const theme = usePersistedStore(s => s.theme)

  return (
    <div className={clsx('default-margin form-chips-component', { 'error-border': error })}>
      <IonLabel position='stacked' color={clsx({ light: isDark(theme) })} style={{ marginLeft: 16 }}>
        {label}
      </IonLabel>
      {children}
    </div>
  )
}
