import { IonTextarea } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import './index.scss'

interface FormTextareaProps<Type extends FieldValues> {
  name: Path<Type>
  control: Control<Type>
}

export const FormTextarea = <Type extends FieldValues>({ name, control }: FormTextareaProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })
  const typedOnChange: ReactHookFormOnChange = onChange

  return <IonTextarea value={value} onIonChange={typedOnChange} autocapitalize='sentences' autoGrow />
}
