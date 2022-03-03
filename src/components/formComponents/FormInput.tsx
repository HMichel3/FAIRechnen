import { IonInput } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface FormInputProps<Type> {
  name: Path<Type>
  control: Control<Type>
}

export const FormInput = <Type extends FieldValues>({ name, control }: FormInputProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  return <IonInput value={value} onIonChange={onChange} autocapitalize='sentences' />
}
