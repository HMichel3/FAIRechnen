import { IonLabel, IonChip, IonCheckbox } from '@ionic/react'
import clsx from 'clsx'
import produce from 'immer'
import { includes, indexOf } from 'ramda'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { isDark } from '../../pages/GroupPage/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import './FormChipsComponent/index.scss'

interface FormCheckboxGroupProps<Type extends FieldValues> {
  name: Path<Type>
  control: Control<Type>
  selectOptions: { id: string; name: string }[]
}

export const FormCheckboxGroup = <Type extends FieldValues>({
  name,
  control,
  selectOptions,
}: FormCheckboxGroupProps<Type>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })
  const theme = usePersistedStore(s => s.theme)

  const onCheckboxChange = (memberId: string, value: string[], onChange: (...event: any[]) => void) => {
    if (includes(memberId, value)) {
      const valueWithoutId = produce(value, draft => {
        const memberIdIndex = indexOf(memberId, value)
        if (memberIdIndex === -1) return
        draft.splice(memberIdIndex, 1)
      })
      return onChange(valueWithoutId)
    }
    const valueWithId = produce(value, draft => {
      draft.push(memberId)
    })
    onChange(valueWithId)
  }

  return (
    <div className='form-chip-group'>
      {selectOptions.map(option => (
        <IonChip
          key={option.id}
          className='form-chip'
          color={clsx({ light: isDark(theme) })}
          outline
          style={{ borderRadius: 18 * 0.125 }} // same border-radius as the IonCheckbox
          onClick={() => onCheckboxChange(option.id, value, onChange)}
        >
          <IonCheckbox
            className='checkbox-input'
            color={clsx({ light: isDark(theme) })}
            style={{ marginRight: 9, marginLeft: 1, marginTop: 1, marginBottom: 1 }} // needed for same size as radio
            checked={includes(option.id, value)}
          />
          <IonLabel className='form-chip-label'>{option.name}</IonLabel>
        </IonChip>
      ))}
    </div>
  )
}
