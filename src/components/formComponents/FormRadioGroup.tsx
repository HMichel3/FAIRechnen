import { IonRadioGroup, IonChip, IonRadio } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { ReactHookFormOnChange } from '../../App/types'

interface FormRadioGroupProps<Type extends FieldValues> {
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
    <IonRadioGroup value={value} className='my-2 flex flex-wrap gap-2'>
      {selectOptions.map(option => (
        <IonChip className='m-0' key={option.id} onClick={() => typedOnChange(option.id)}>
          <IonRadio value={option.id}>{option.name}</IonRadio>
        </IonChip>
      ))}
    </IonRadioGroup>
  )
}
