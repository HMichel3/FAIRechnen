import { IonInput } from '@ionic/react'
import { trim } from 'ramda'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { ReactHookFormOnChange } from '../../App/types'
import { cn } from '../../App/utils'

type FormInputProps<Type extends FieldValues> = {
  label: string
  name: Path<Type>
  control: Control<Type>
  className?: string
}

export const FormInput = <Type extends FieldValues>({ label, name, control, className }: FormInputProps<Type>) => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })
  const typedOnChange: ReactHookFormOnChange = onChange

  return (
    <IonInput
      className={cn({ 'ion-invalid ion-touched': invalid }, className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      value={value}
      onIonInput={typedOnChange}
      onIonBlur={() => typedOnChange(trim(value))}
      autocapitalize='sentences'
    />
  )
}
