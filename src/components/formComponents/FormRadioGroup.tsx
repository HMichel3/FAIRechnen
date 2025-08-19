import { IonChip, IonRadio, IonRadioGroup } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { ReactHookFormOnChange } from '../../App/types'
import './formRadioGroup.css'

type FormRadioGroupProps<Type extends FieldValues> = {
  name: Path<Type>
  control: Control<Type>
  selectOptions: { id: string; name: string }[]
}

export const FormRadioGroup = <Type extends FieldValues>({
  name,
  control,
  selectOptions,
}: FormRadioGroupProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })
  const typedOnChange: ReactHookFormOnChange = onChange

  return (
    <IonRadioGroup className='form-radio-group' value={value}>
      {selectOptions.map(option => (
        <IonChip className='m-0' key={option.id} onClick={() => typedOnChange(option.id)}>
          <IonRadio value={option.id}>{option.name}</IonRadio>
        </IonChip>
      ))}
    </IonRadioGroup>
  )
}
