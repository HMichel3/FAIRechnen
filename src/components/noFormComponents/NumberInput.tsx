import { Dispatch, SetStateAction } from 'react'
import { IonInput } from '@ionic/react'
import { cn } from '../../App/utils'
import { useMaskito } from '@maskito/react'
import { maskitoNumberOptionsGenerator, maskitoParseNumber } from '@maskito/kit'

export const parseCommaNumber = (value: string) => maskitoParseNumber(value || '0', ',')

const digitsOnlyMask = maskitoNumberOptionsGenerator({
  precision: Infinity,
  min: 0,
  thousandSeparator: '',
  decimalSeparator: ',',
})

interface NumberInputProps {
  label: string
  value: string
  onChange: Dispatch<SetStateAction<string>>
  className?: string
}

export const NumberInput = ({ label, value, onChange, className }: NumberInputProps) => {
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
