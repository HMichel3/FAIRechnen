import { IonChip, IonRadio, IonRadioGroup } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

type FormRadioGroupProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  selectOptions: { id: string; name: string }[]
}

export const FormRadioGroup = <T extends FieldValues>({ name, control, selectOptions }: FormRadioGroupProps<T>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  return (
    <IonRadioGroup className='form-radio-group' value={value}>
      {selectOptions.map(option => (
        <IonChip className='m-0' key={option.id} onClick={() => onChange(option.id)}>
          <IonRadio value={option.id}>{option.name}</IonRadio>
        </IonChip>
      ))}
    </IonRadioGroup>
  )
}
