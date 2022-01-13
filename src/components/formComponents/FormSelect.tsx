import { IonSelect, IonSelectOption } from '@ionic/react'
import { map } from 'ramda'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface FormSelectProps<Type> {
  name: Path<Type>
  control: Control<Type>
  selectOptions: { id: string; name: string }[]
  multiple?: boolean
}

export const FormSelect = <Type extends FieldValues>({
  name,
  control,
  selectOptions,
  multiple = false,
}: FormSelectProps<Type>) => (
  <Controller
    render={({ field }) => (
      <IonSelect
        interface='popover'
        interfaceOptions={{ cssClass: 'basic-select-popover' }}
        value={field.value}
        onIonChange={field.onChange}
        multiple={multiple}
      >
        {map(
          selectOption => (
            <IonSelectOption key={selectOption.id} value={selectOption.id}>
              {selectOption.name}
            </IonSelectOption>
          ),
          selectOptions
        )}
      </IonSelect>
    )}
    control={control}
    name={name}
  />
)
