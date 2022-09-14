import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react'
import clsx from 'clsx'
import { closeSharp } from 'ionicons/icons'
import { isNil } from 'ramda'
import { ReactNode } from 'react'
import { FieldError } from 'react-hook-form'
import { isDark } from '../../../pages/GroupPage/utils'
import { usePersistedStore } from '../../../stores/usePersistedStore'
import { Show } from '../../SolidComponents/Show'
import './index.scss'

interface FormComponentProps {
  label: string
  children: ReactNode
  error?: FieldError
  onDelete?: () => void
  className?: string
}

export const FormComponent = ({
  label,
  children,
  error,
  onDelete,
  className = 'default-margin',
}: FormComponentProps): JSX.Element => {
  const theme = usePersistedStore(s => s.theme)

  return (
    <IonItem className={clsx('form-component', { 'error-border-native': error }, className)} fill='outline'>
      <IonLabel position='stacked' color={clsx({ light: isDark(theme) })}>
        {label}
      </IonLabel>
      {children}
      <Show when={!isNil(onDelete)}>
        <IonButton slot='end' color='danger' fill='clear' onClick={onDelete}>
          <IonIcon slot='icon-only' icon={closeSharp} />
        </IonButton>
      </Show>
    </IonItem>
  )
}