import { IonCheckbox, IonChip } from '@ionic/react'
import { produce } from 'immer'
import { includes, indexOf } from 'ramda'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

type FormCheckboxGroupProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  selectOptions: { id: string; name: string }[]
}

export const FormCheckboxGroup = <T extends FieldValues>({
  name,
  control,
  selectOptions,
}: FormCheckboxGroupProps<T>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  const onCheckboxChange = (event: CustomEvent, memberId: string) => {
    const { checked } = event.detail
    if (!checked) {
      const valueWithoutId = produce<string[]>(value, draft => {
        const memberIdIndex = indexOf(memberId, value)
        if (memberIdIndex === -1) return
        draft.splice(memberIdIndex, 1)
      })
      return onChange(valueWithoutId)
    }
    const valueWithId = produce<string[]>(value, draft => {
      draft.push(memberId)
    })
    onChange(valueWithId)
  }

  return (
    <div className='my-2 flex flex-wrap gap-2'>
      {selectOptions.map(option => (
        <IonChip className='m-0' key={option.id}>
          <IonCheckbox checked={includes(option.id, value)} onIonChange={event => onCheckboxChange(event, option.id)}>
            {option.name}
          </IonCheckbox>
        </IonChip>
      ))}
    </div>
  )
}
