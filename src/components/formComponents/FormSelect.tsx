import { IonSelect, IonSelectOption } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { cn } from '../../App/utils'

type FormSelectProps<T extends FieldValues> = {
  label: string
  name: Path<T>
  control: Control<T>
  selectOptions: { id: string; name: string }[]
  className?: string
}

export const FormSelect = <T extends FieldValues>({
  label,
  name,
  control,
  selectOptions,
  className,
}: FormSelectProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })

  return (
    <IonSelect
      className={cn({ 'ion-invalid ion-touched': invalid }, className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      interface='popover'
      value={value}
      onIonChange={onChange}
    >
      {selectOptions.map(option => (
        <IonSelectOption key={option.id} value={option.id}>
          {option.name}
        </IonSelectOption>
      ))}
    </IonSelect>
  )
}
