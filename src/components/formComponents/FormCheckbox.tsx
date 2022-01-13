import { IonCheckbox } from '@ionic/react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface FormCheckboxProps<Type> {
  name: Path<Type>
  control: Control<Type>
}

export const FormCheckbox = <Type extends FieldValues>({ name, control }: FormCheckboxProps<Type>) => (
  <Controller
    render={({ field }) => (
      <IonCheckbox
        className='checkbox-input'
        color='light'
        checked={field.value}
        onIonChange={({ detail }) => field.onChange(detail.checked)}
      />
    )}
    control={control}
    name={name}
  />
)
