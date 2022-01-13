import { IonInput } from '@ionic/react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface FormInputProps<Type> {
  name: Path<Type>
  control: Control<Type>
}

export const FormInput = <Type extends FieldValues>({ name, control }: FormInputProps<Type>) => (
  <Controller
    render={({ field }) => <IonInput value={field.value} onIonChange={field.onChange} autocapitalize='sentences' />}
    control={control}
    name={name}
  />
)
