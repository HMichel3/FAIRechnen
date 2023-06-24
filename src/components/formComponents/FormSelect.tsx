import { IonSelect, IonSelectOption } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface FormSelectProps<Type extends FieldValues> {
  name: Path<Type>
  control: Control<Type>
  selectOptions: { id: string; name: string }[]
}

export const FormSelect = <Type extends FieldValues>({ name, control, selectOptions }: FormSelectProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })
  const onChangeTyped: ReactHookFormOnChange = onChange

  return (
    <IonSelect
      interface='popover'
      interfaceOptions={{ cssClass: 'basic-select-popover' }}
      value={value}
      onIonChange={onChangeTyped}
    >
      {selectOptions.map(option => (
        <IonSelectOption key={option.id} value={option.id}>
          {option.name}
        </IonSelectOption>
      ))}
    </IonSelect>
  )
}
