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
        <IonChip
          key={memberId}
          className='form-chip'
          color='light'
          outline
          style={{ borderRadius: 18 * 0.125 }} // same border-radius as the IonCheckbox
          onClick={() => onCheckboxChange(memberId)}
        >
          <IonCheckbox
            className='checkbox-input'
            color='light'
            style={{ marginRight: 9, marginLeft: 1, marginTop: 1, marginBottom: 1 }} // needed for same size as radio
            checked={includes(memberId, value)}
          />
          <IonLabel className='form-chip-label'>{name}</IonLabel>
        </IonChip>
      ))}
    </div>
  )
}
