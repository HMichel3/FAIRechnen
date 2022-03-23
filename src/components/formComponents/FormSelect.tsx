import { IonSelect, IonSelectOption } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface FormSelectProps<Type> {
  name: Path<Type>
  control: Control<Type>
  selectOptions: { id: string; name: string }[]
  multiple?: boolean
}

export const FormSelect = <Type extends FieldValues>({
  name,
  control,
  selectOptions,
  multiple = false,
}: FormSelectProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  return (
    <IonSelect
      interface='popover'
      interfaceOptions={{ cssClass: 'basic-select-popover' }}
      value={value}
      onIonChange={onChange}
      multiple={multiple}
    >
      {selectOptions.map(option => (
        <IonSelectOption key={option.id} value={option.id}>
          {option.name}
        </IonSelectOption>
      ))}
    </IonSelect>
  )
}
