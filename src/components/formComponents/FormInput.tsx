import { IonInput } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface FormInputProps<Type> {
  name: Path<Type>
  control: Control<Type>
}

export const FormInput = <Type extends FieldValues>({ name, control }: FormInputProps<Type>) => {
  const {
    field: { ref, value, onChange, onBlur },
  } = useController({ name, control })

  return (
    <IonInput
      ref={ref}
      name={name}
      value={value}
      onIonChange={onChange}
      onIonBlur={onBlur}
      autocapitalize='sentences'
    />
  )
}
