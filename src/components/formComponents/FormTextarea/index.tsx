import { IonTextarea } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import './index.scss'

interface FormTextareaProps<Type> {
  name: Path<Type>
  control: Control<Type>
}

export const FormTextarea = <Type extends FieldValues>({ name, control }: FormTextareaProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  return <IonTextarea value={value} onIonChange={onChange} autocapitalize='sentences' autoGrow />
}
