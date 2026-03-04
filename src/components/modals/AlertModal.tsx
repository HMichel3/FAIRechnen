import { IonButton, IonModal } from '@ionic/react'
import { ComponentProps, ComponentType, PropsWithChildren } from 'react'
import { cn } from '../../utils/common'
import './alertModal.css'

type AlertRootProps<CProps extends Record<string, unknown>> = {
  overlay: { isOpen: boolean; onDidDismiss: () => void; onDismiss: () => void }
  component: ComponentType<CProps>
  componentProps?: Omit<CProps, 'onDismiss'>
} & Omit<ComponentProps<typeof IonModal>, 'isOpen' | 'onDidDismiss' | 'children'>

const AlertRoot = <CProps extends Record<string, unknown>>({
  overlay,
  component: Component,
  componentProps,
  className,
  ...props
}: AlertRootProps<CProps>) => {
  return (
    <IonModal
      className={cn('custom-alert-modal', className)}
      isOpen={overlay.isOpen}
      onDidDismiss={overlay.onDidDismiss}
      {...props}
    >
      <Component onDismiss={overlay.onDismiss} {...(componentProps as CProps)} />
    </IonModal>
  )
}

type AlertHeaderProps = {
  title: string
}

const AlertHeader = ({ title }: AlertHeaderProps) => {
  return (
    <div className='custom-alert-head'>
      <h2 className='custom-alert-title'>{title}</h2>
    </div>
  )
}

const AlertBody = ({ children }: PropsWithChildren) => {
  return <div className='custom-alert-message'>{children}</div>
}

type AlertFooterProps = {
  onDismiss: () => void
  dismissLabel?: string
  submitLabel?: string
} & (
  | {
      onSubmit: () => void
      form?: never
    }
  | {
      form: string
      onSubmit?: never
    }
)

const AlertFooter = (props: AlertFooterProps) => {
  const { onDismiss, dismissLabel = 'Abbrechen', submitLabel = 'Übernehmen' } = props

  const isFormMode = 'form' in props

  function onSave() {
    if (isFormMode) return
    props.onSubmit()
    onDismiss()
  }

  return (
    <div className='custom-alert-button-group'>
      <IonButton className='custom-alert-button' fill='clear' size='small' color='dark' onClick={onDismiss}>
        {dismissLabel}
      </IonButton>
      <IonButton
        className='custom-alert-button'
        fill='clear'
        size='small'
        type={isFormMode ? 'submit' : 'button'}
        form={isFormMode ? props.form : undefined}
        onClick={isFormMode ? undefined : onSave}
      >
        {submitLabel}
      </IonButton>
    </div>
  )
}

export const AlertModal = Object.assign(AlertRoot, {
  Header: AlertHeader,
  Body: AlertBody,
  Footer: AlertFooter,
})
