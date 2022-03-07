import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react'
import clsx from 'clsx'
import { alertCircleSharp, closeSharp } from 'ionicons/icons'
import { ReactNode } from 'react'
import { FieldError } from 'react-hook-form'
import { isDark } from '../../pages/GroupPage/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'

interface FormComponentProps {
  label: string
  children: ReactNode
  error?: FieldError
  onDelete?: () => void
  className?: string
  noMargin?: boolean
}

export const FormComponent = ({
  label,
  children,
  error,
  onDelete,
  className,
  noMargin = false,
}: FormComponentProps): JSX.Element => {
  const theme = usePersistedStore.useTheme()

  return (
    <IonItem
      className={clsx('form-component', !noMargin ? 'form-input-margin' : 'form-input-no-margin', className)}
      fill='outline'
    >
      <IonLabel position='stacked' color={clsx({ light: isDark(theme) })}>
        {label}
      </IonLabel>
      {children}
      {error && <IonIcon slot='end' icon={alertCircleSharp} color='danger' />}
      {onDelete && (
        <IonButton slot='end' color='danger' fill='clear' onClick={onDelete}>
          <IonIcon slot='icon-only' icon={closeSharp} />
        </IonButton>
      )}
    </IonItem>
  )
}
