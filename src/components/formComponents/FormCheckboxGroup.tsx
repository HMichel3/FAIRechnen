import { IonChip, IonCheckbox } from '@ionic/react'
import { produce } from 'immer'
import { includes, indexOf } from 'ramda'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { ReactHookFormOnChange } from '../../App/types'

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
  const typedOnChange: ReactHookFormOnChange = onChange

  const onCheckboxChange = (event: CustomEvent, memberId: string) => {
    const { checked } = event.detail
    if (!checked) {
      const valueWithoutId = produce<string[]>(value, draft => {
        const memberIdIndex = indexOf(memberId, value)
        if (memberIdIndex === -1) return
        draft.splice(memberIdIndex, 1)
      })
      return typedOnChange(valueWithoutId)
    }
    const valueWithId = produce<string[]>(value, draft => {
      draft.push(memberId)
    })
    typedOnChange(valueWithId)
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
