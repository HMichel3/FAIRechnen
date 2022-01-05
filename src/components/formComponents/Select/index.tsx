import { forwardRef } from 'react'
import { ChangeHandler, FieldError } from 'react-hook-form'
import { FormComponent } from '../FormComponent'
import { BasicSelect } from './BasicSelect'
import { MultipleSelect } from './MultipleSelect'
import { SelectOption } from './SelectOptions'

interface SelectProps {
  label: string
  name: string
  placeholder: string
  onChange: ChangeHandler
  selectOptions: SelectOption[]
  error?: FieldError
  multipleSelect?: boolean
  lines?: 'full' | 'inset' | 'none'
}

export const Select = forwardRef<HTMLIonSelectElement, SelectProps>(
  ({ label, error, multipleSelect = false, lines = 'inset', ...props }, ref): JSX.Element => (
    <FormComponent label={label} error={error} lines={lines}>
      {!multipleSelect && <BasicSelect ref={ref} {...props} />}
      {multipleSelect && <MultipleSelect ref={ref} {...props} />}
    </FormComponent>
  )
)
