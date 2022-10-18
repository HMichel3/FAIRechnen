import { IonLabel } from '@ionic/react'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { FieldError, Merge } from 'react-hook-form'
import { isDark } from '../../../pages/GroupPage/utils'
import { usePersistedStore } from '../../../stores/usePersistedStore'
import './index.scss'

interface FormChipsComponentProps {
  label: string
  children: ReactNode
  error?: Merge<FieldError, (FieldError | undefined)[]> | undefined
  className?: string
}

export const FormChipsComponent = ({
  label,
  children,
  error,
  className = 'default-margin',
}: FormChipsComponentProps) => {
  const theme = usePersistedStore(s => s.theme)

  return (
    <div className={clsx('form-chips-component', { 'error-border': error }, className)}>
      <IonLabel position='stacked' color={clsx({ light: isDark(theme) })} style={{ marginLeft: 16 }}>
        {label}
      </IonLabel>
      {children}
    </div>
  )
}
