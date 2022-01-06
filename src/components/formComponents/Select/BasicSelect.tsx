import { IonSelect } from '@ionic/react'
import { forwardRef } from 'react'
import { ChangeHandler } from 'react-hook-form'
import { SelectOptions, SelectOption } from './SelectOptions'

interface BasicSelectProps {
  name: string
  placeholder: string
  onChange: ChangeHandler
  selectOptions: SelectOption[]
}

export const BasicSelect = forwardRef<HTMLIonSelectElement, BasicSelectProps>(
  ({ onChange, selectOptions, ...props }, ref): JSX.Element => (
    <IonSelect
      ref={ref}
      interface='popover'
      interfaceOptions={{ cssClass: 'basic-select-popover' }}
      onIonChange={onChange}
      {...props}
    >
      <SelectOptions selectOptions={selectOptions} />
    </IonSelect>
  )
)
