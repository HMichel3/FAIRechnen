import { IonTextarea } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { ReactHookFormOnChange } from '../../App/types'
import { cn } from '../../App/utils'

type FormTextareaProps<Type extends FieldValues> = {
  label: string
  name: Path<Type>
  control: Control<Type>
  className?: string
}

export const FormTextarea = <Type extends FieldValues>({
  label,
  name,
  control,
  className,
}: FormTextareaProps<Type>) => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })
  const typedOnChange: ReactHookFormOnChange = onChange

  return (
    <IonTextarea
      className={cn({ 'ion-invalid ion-touched': invalid }, className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      value={value}
      onIonChange={typedOnChange}
      autocapitalize='sentences'
      autoGrow
    />
  )
}
