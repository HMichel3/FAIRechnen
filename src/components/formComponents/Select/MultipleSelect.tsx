import { IonSelect } from '@ionic/react'
import { forwardRef } from 'react'
import { ChangeHandler } from 'react-hook-form'
import { SelectOptions, SelectOption } from './SelectOptions'

interface MultipleSelectProps {
  name: string
  placeholder: string
  onChange: ChangeHandler
  selectOptions: SelectOption[]
}

export const MultipleSelect = forwardRef<HTMLIonSelectElement, MultipleSelectProps>(
  ({ onChange, selectOptions, ...props }, ref): JSX.Element => (
    <IonSelect
      ref={ref}
      interface='popover'
      interfaceOptions={{ cssClass: 'basic-select-popover' }}
      multiple
      onIonChange={onChange}
      {...props}
    >
      <SelectOptions selectOptions={selectOptions} />
    </IonSelect>
  )
)
