import { IonLabel, IonRadioGroup, IonChip, IonRadio } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import './FormChipsComponent/index.scss'

interface FormRadioGroupProps<Type> {
  name: Path<Type>
  control: Control<Type>
  selectOptions: { memberId: string; name: string }[]
}

export const FormRadioGroup = <Type extends FieldValues>({
  name,
  control,
  selectOptions,
}: FormRadioGroupProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  return (
    <IonRadioGroup className='form-chip-group' value={value}>
      {selectOptions.map(({ memberId, name }) => (
        <IonChip className='form-chip' color='light' key={memberId} outline onClick={() => onChange(memberId)}>
          <IonRadio style={{ marginRight: 8 }} color='light' value={memberId} />
          <IonLabel className='form-chip-label'>{name}</IonLabel>
        </IonChip>
      ))}
    </IonRadioGroup>
  )
}
