import { IonInput } from '@ionic/react'
import { trim } from 'ramda'
import { KeyboardEventHandler } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { cn } from '../../App/utils'

type FormInputProps<T extends FieldValues> = {
  label: string
  name: Path<T>
  control: Control<T>
  className?: string
  onKeyDown?: KeyboardEventHandler<HTMLIonInputElement>
}

export const FormInput = <T extends FieldValues>({ label, name, control, className, onKeyDown }: FormInputProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })

  return (
    <IonInput
      className={cn({ 'ion-invalid ion-touched': invalid }, className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      value={value}
      onIonInput={onChange}
      onIonBlur={() => onChange(trim(value))}
      autocapitalize='sentences'
      onKeyDown={onKeyDown}
    />
  )
}
