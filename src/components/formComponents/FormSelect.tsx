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
    field: { ref, value, onChange, onBlur },
  } = useController({ name, control })

  return (
    <IonSelect
      interface='popover'
      interfaceOptions={{ cssClass: 'basic-select-popover' }}
      ref={ref}
      name={name}
      value={value}
      onIonChange={onChange}
      onIonBlur={onBlur}
      multiple={multiple}
    >
      {selectOptions.map(selectOption => (
        <IonSelectOption key={selectOption.id} value={selectOption.id}>
          {selectOption.name}
        </IonSelectOption>
      ))}
    </IonSelect>
  )
}
