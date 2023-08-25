import { IonInput } from '@ionic/react'
import { isNotNil, toString } from 'ramda'
import { Dispatch, SetStateAction, useRef } from 'react'
import { cn, displayCurrencyValueNoSign } from '../../App/utils'

interface CurrencyInputProps {
  label: string
  value: number
  onChange: Dispatch<SetStateAction<number>>
  className?: string
}

const VALID_FIRST = /^[1-9]{1}$/
const VALID_NEXT = /^[0-9]{1}$/
const DELETE_INPUT = 'deleteContentBackward'
const MAX = Number.MAX_SAFE_INTEGER

export const CurrencyInput = ({ label, value, onChange, className }: CurrencyInputProps): JSX.Element => {
  const ionInputRef = useRef<HTMLIonInputElement>(null)

  const valueAbsTrunc = Math.trunc(Math.abs(value))

  if (value !== valueAbsTrunc || !Number.isFinite(value) || Number.isNaN(value)) {
    throw new Error(`invalid value property`)
  }

  const onKeyDown = (event: CustomEvent): void => {
    const { data, inputType } = event.detail.event
    const inputComponent = ionInputRef.current

    if (
      isNotNil(inputComponent) &&
      ((value === 0 && !VALID_FIRST.test(data)) ||
        (value !== 0 && !VALID_NEXT.test(data) && inputType !== DELETE_INPUT))
    ) {
      inputComponent.value = displayCurrencyValueNoSign(value)
      return
    }

    const valueString = toString(value)
    let nextValue: number

    if (inputType !== DELETE_INPUT) {
      const nextValueString: string = value === 0 ? data : `${valueString}${data}`
      nextValue = Number.parseInt(nextValueString, 10)
    } else {
      const nextValueString = valueString.slice(0, -1)
      nextValue = nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10)
    }

    if (nextValue > MAX && isNotNil(inputComponent)) {
      inputComponent.value = displayCurrencyValueNoSign(value)
      return
    }

    onChange(nextValue)
  }

  return (
    <IonInput
      ref={ionInputRef}
      className={cn(className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      value={displayCurrencyValueNoSign(value)}
      onIonInput={onKeyDown}
      inputMode='numeric'
    />
  )
}
