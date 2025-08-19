import { IonSelect, IonSelectOption } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { ReactHookFormOnChange } from '../../App/types'
import { cn } from '../../App/utils'

type FormSelectProps<Type extends FieldValues> = {
  label: string
  name: Path<Type>
  control: Control<Type>
  selectOptions: { id: string; name: string }[]
  className?: string
}

export const FormSelect = <Type extends FieldValues>({
  label,
  name,
  control,
  selectOptions,
  className,
}: FormSelectProps<Type>) => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })
  const typedOnChange: ReactHookFormOnChange = onChange

  return (
    <IonSelect
      className={cn({ 'ion-invalid ion-touched': invalid }, className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      interface='popover'
      value={value}
      onIonChange={typedOnChange}
    >
      {selectOptions.map(option => (
        <IonSelectOption key={option.id} value={option.id}>
          {option.name}
        </IonSelectOption>
      ))}
    </IonSelect>
  )
}
