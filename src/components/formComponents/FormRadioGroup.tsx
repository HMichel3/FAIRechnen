import { IonLabel, IonRadioGroup, IonChip, IonRadio } from '@ionic/react'
import clsx from 'clsx'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { isDark } from '../../pages/GroupPage/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
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
  const theme = usePersistedStore.useTheme()

  return (
    <IonRadioGroup className='form-chip-group' value={value}>
      {selectOptions.map(({ memberId, name }) => (
        <IonChip
          key={memberId}
          className='form-chip'
          color={clsx({ light: isDark(theme) })}
          outline
          onClick={() => onChange(memberId)}
        >
          <IonRadio style={{ marginRight: 8 }} color={clsx({ light: isDark(theme) })} value={memberId} />
          <IonLabel className='form-chip-label'>{name}</IonLabel>
        </IonChip>
      ))}
    </IonRadioGroup>
  )
}
