import { IonLabel, IonRadioGroup, IonChip, IonRadio } from '@ionic/react'
import clsx from 'clsx'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { isDark } from '../../pages/GroupPage/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import './FormChipsComponent/index.scss'

interface FormRadioGroupProps<Type> {
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
  const theme = usePersistedStore(s => s.theme)

  return (
    <IonRadioGroup className='form-chip-group' value={value}>
      {selectOptions.map(option => (
        <IonChip
          key={option.id}
          className='form-chip'
          color={clsx({ light: isDark(theme) })}
          outline
          onClick={() => onChange(option.id)}
        >
          <IonRadio style={{ marginRight: 8 }} color={clsx({ light: isDark(theme) })} value={option.id} />
          <IonLabel className='form-chip-label'>{option.name}</IonLabel>
        </IonChip>
      ))}
    </IonRadioGroup>
  )
}
