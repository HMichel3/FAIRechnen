import { IonCheckbox } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface FormCheckboxProps<Type> {
  name: Path<Type>
  control: Control<Type>
}

export const FormCheckbox = <Type extends FieldValues>({ name, control }: FormCheckboxProps<Type>) => {
  const {
    field: { ref, value, onChange, onBlur },
  } = useController({ name, control })

  return (
    <IonCheckbox
      className='checkbox-input'
      color='light'
      ref={ref}
      name={name}
      checked={value}
      onIonChange={({ detail }) => onChange(detail.checked)}
      onIonBlur={onBlur}
    />
  )
}
