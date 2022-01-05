import { IonCheckbox, IonItem, IonLabel } from '@ionic/react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface CheckboxProps<Type> {
  label: string
  name: Path<Type>
  control: Control<Type>
  lines?: 'full' | 'inset' | 'none'
}

export const Checkbox = <Type extends FieldValues>({
  label,
  name,
  control,
  lines = 'inset',
}: CheckboxProps<Type>): JSX.Element => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  return (
    <IonItem lines={lines}>
      <IonLabel>{label}</IonLabel>
      <IonCheckbox className='checkbox-input' checked={value} onIonChange={({ detail }) => onChange(detail.checked)} />
    </IonItem>
  )
}
