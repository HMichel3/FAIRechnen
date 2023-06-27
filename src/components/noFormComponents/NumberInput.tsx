import { Dispatch, SetStateAction } from 'react'
import { IonInput } from '@ionic/react'

interface NumberInputProps {
  value: number
  onChange: Dispatch<SetStateAction<number>>
}

export const NumberInput = ({ value, onChange }: NumberInputProps) => (
  <IonInput
    value={value}
    onIonChange={event => onChange(Math.abs(+event.detail.value!))}
    onIonBlur={() => onChange(Math.abs(+value))}
    type='number'
    inputMode='numeric'
    lang='de'
    min={0}
  />
)
