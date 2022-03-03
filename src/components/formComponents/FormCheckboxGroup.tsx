import { IonLabel, IonChip, IonCheckbox } from '@ionic/react'
import { equals, includes, reject } from 'ramda'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import './FormChipsComponent/index.scss'

interface FormCheckboxGroupProps<Type> {
  name: Path<Type>
  control: Control<Type>
  selectOptions: { memberId: string; name: string }[]
}

export const FormCheckboxGroup = <Type extends FieldValues>({
  name,
  control,
  selectOptions,
}: FormCheckboxGroupProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  const onCheckboxChange = (memberId: string) => {
    if (includes(memberId, value)) {
      return onChange(reject(equals(memberId), value))
    }
    onChange([...value, memberId])
  }

  return (
    <div className='form-chip-group'>
      {selectOptions.map(({ memberId, name }) => (
        <IonChip className='form-chip' color='light' key={memberId} outline onClick={() => onCheckboxChange(memberId)}>
          <IonCheckbox
            className='checkbox-input'
            style={{ marginRight: 8 }}
            color='light'
            checked={includes(memberId, value)}
          />
          <IonLabel className='form-chip-label'>{name}</IonLabel>
        </IonChip>
      ))}
    </div>
  )
}
