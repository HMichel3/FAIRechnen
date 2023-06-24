import { IonInput } from '@ionic/react'
import { trim } from 'ramda'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface FormInputProps<Type extends FieldValues> {
  name: Path<Type>
  control: Control<Type>
}

export const FormInput = <Type extends FieldValues>({ name, control }: FormInputProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })
  const typedOnChange: ReactHookFormOnChange = onChange

  return (
    <IonInput
      value={value}
      onIonChange={typedOnChange}
      onIonBlur={() => typedOnChange(trim(value))}
      autocapitalize='sentences'
    />
  )
}
