import { CheckboxCustomEvent, IonCheckbox, IonChip } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { filter, unique } from 'remeda'

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

  const onCheckboxChange = (event: CheckboxCustomEvent, optionId: string) => {
    const { checked } = event.detail
    const newValue = checked ? unique([...value, optionId]) : filter(value, id => id !== optionId)
    onChange(newValue)
  }

  return (
    <div className='my-2 flex flex-wrap gap-2'>
      {selectOptions.map(option => (
        <IonChip className='m-0' key={option.id}>
          <IonCheckbox checked={value.includes(option.id)} onIonChange={event => onCheckboxChange(event, option.id)}>
            {option.name}
          </IonCheckbox>
        </IonChip>
      ))}
    </div>
  )
}
