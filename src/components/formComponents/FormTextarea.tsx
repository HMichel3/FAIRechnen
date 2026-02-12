import { IonTextarea } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { cn } from '../../App/utils'

type FormTextareaProps<T extends FieldValues> = {
  label: string
  name: Path<T>
  control: Control<T>
  className?: string
}

export const FormTextarea = <T extends FieldValues>({ label, name, control, className }: FormTextareaProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })

  return (
    <IonTextarea
      className={cn({ 'ion-invalid ion-touched': invalid }, className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      value={value}
      onIonChange={onChange}
      autocapitalize='sentences'
      autoGrow
    />
  )
}
