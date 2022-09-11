import { IonSelect, IonSelectOption } from '@ionic/react'
import { Control, FieldValues, Path, RegisterOptions, useController } from 'react-hook-form'

interface FormSelectProps<Type extends FieldValues> {
  name: Path<Type>
  control: Control<Type>
  selectOptions: { id: string; name: string }[]
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
}

export const FormSelect = <Type extends FieldValues>({
  name,
  control,
  selectOptions,
  rules,
}: FormSelectProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control, rules })

  return (
    <IonSelect
      interface='popover'
      interfaceOptions={{ cssClass: 'basic-select-popover' }}
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
