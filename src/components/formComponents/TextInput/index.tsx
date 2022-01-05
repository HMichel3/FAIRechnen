import { IonInput } from '@ionic/react'
import { forwardRef } from 'react'
import { ChangeHandler, FieldError } from 'react-hook-form'
import { FormComponent } from '../FormComponent'

interface TextInputProps {
  label: string
  placeholder: string
  name: string
  onChange: ChangeHandler
  error?: FieldError
  onDelete?: () => void
  lines?: 'full' | 'inset' | 'none'
}

export const TextInput = forwardRef<HTMLIonInputElement, TextInputProps>(
  ({ label, onChange, error, onDelete, lines = 'inset', ...props }, ref): JSX.Element => (
    <FormComponent label={label} error={error} onDelete={onDelete} lines={lines}>
      <IonInput className='text-input' ref={ref} autocapitalize='sentences' onIonChange={onChange} {...props} />
    </FormComponent>
  )
)
