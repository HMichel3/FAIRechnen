import { IonInput } from '@ionic/react'
import { trim } from 'ramda'
import { Control, FieldValues, Path, RegisterOptions, useController } from 'react-hook-form'

interface FormInputProps<Type extends FieldValues> {
  name: Path<Type>
  control: Control<Type>
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
}

export const FormInput = <Type extends FieldValues>({ name, control, rules }: FormInputProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control, rules })

  return (
    <IonInput value={value} onIonChange={onChange} onIonBlur={() => onChange(trim(value))} autocapitalize='sentences' />
  )
}
