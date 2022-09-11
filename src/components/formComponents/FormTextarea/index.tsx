import { IonTextarea } from '@ionic/react'
import { Control, FieldValues, Path, RegisterOptions, useController } from 'react-hook-form'
import './index.scss'

interface FormTextareaProps<Type extends FieldValues> {
  name: Path<Type>
  control: Control<Type>
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
}

export const FormTextarea = <Type extends FieldValues>({ name, control, rules }: FormTextareaProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control, rules })

  return <IonTextarea value={value} onIonChange={onChange} autocapitalize='sentences' autoGrow />
}
