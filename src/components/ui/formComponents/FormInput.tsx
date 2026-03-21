import { IonInput } from '@ionic/react'
import { ComponentProps } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { cn } from '../../../utils/common'

type FormInputProps<T extends FieldValues> = ComponentProps<typeof IonInput> & {
  name: Path<T>
  control: Control<T>
}

export const FormInput = <T extends FieldValues>({ name, control, className, ...props }: FormInputProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })

  return (
    <IonInput
      className={cn({ 'ion-invalid ion-touched': invalid }, className)}
      fill='solid'
      labelPlacement='floating'
      value={value}
      onIonInput={onChange}
      onIonBlur={() => onChange(value.trim())}
      autocapitalize='sentences'
      {...props}
    />
  )
}
