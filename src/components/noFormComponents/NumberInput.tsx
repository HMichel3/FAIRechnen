import { IonInput } from '@ionic/react'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'
import { useMaskito } from '@maskito/react'
import { cn } from '../../App/utils'

const digitsOnlyMask = maskitoNumberOptionsGenerator({
  precision: Infinity,
  min: 0,
  thousandSeparator: '',
  decimalSeparator: ',',
})

type NumberInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export const NumberInput = ({ label, value, onChange, className }: NumberInputProps): JSX.Element => {
  const inputRef = useMaskito({ options: digitsOnlyMask })

  return (
    <IonInput
      ref={async ionInput => {
        if (ionInput) {
          const input = await ionInput.getInputElement()
          inputRef(input)
        }
      }}
      className={cn(className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      value={value}
      onIonInput={e => onChange(e.target.value as string)}
      inputMode='numeric'
    />
  )
}
