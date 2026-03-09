import { InputCustomEvent, IonInput } from '@ionic/react'
import { useRef } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { isNonNull } from 'remeda'
import { cn } from '../../../utils/common'
import { displayCurrencyValue } from '../../../utils/display'

type FormCurrencyProps<T extends FieldValues> = {
  label: string
  name: Path<T>
  control: Control<T>
  className?: string
}

const VALID_FIRST = /^[1-9]{1}$/
const VALID_NEXT = /^[0-9]{1}$/
const DELETE_INPUT = 'deleteContentBackward'
const MAX = Number.MAX_SAFE_INTEGER

export const FormCurrency = <T extends FieldValues>({ label, name, control, className }: FormCurrencyProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })
  const ionInputRef = useRef<HTMLIonInputElement>(null)

  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`invalid value property: ${value}`)
  }

  const onInput = (event: InputCustomEvent): void => {
    const inputEvent = event.detail.event as InputEvent
    const data = inputEvent?.data
    const inputType = inputEvent?.inputType
    const inputComponent = ionInputRef.current

    if (isNonNull(inputComponent)) {
      const isInvalidFirstDigit = value === 0 && (data === null || !VALID_FIRST.test(data))
      const isInvalidNextDigit = value !== 0 && inputType !== DELETE_INPUT && (data === null || !VALID_NEXT.test(data))

      if (isInvalidFirstDigit || isInvalidNextDigit) {
        inputComponent.value = displayCurrencyValue(value)
        return
      }
    }

    const valueString = String(value)
    let nextValue: number

    if (inputType !== DELETE_INPUT) {
      const nextValueString: string = value === 0 ? (data ?? '') : `${valueString}${data}`
      nextValue = Number.parseInt(nextValueString, 10)
    } else {
      const nextValueString = valueString.slice(0, -1)
      nextValue = nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10)
    }

    if (nextValue > MAX && isNonNull(inputComponent)) {
      inputComponent.value = displayCurrencyValue(value)
      return
    }

    onChange(nextValue)
  }

  return (
    <IonInput
      ref={ionInputRef}
      className={cn({ 'ion-invalid ion-touched': invalid }, className)}
      fill='solid'
      labelPlacement='floating'
      label={label}
      value={displayCurrencyValue(value)}
      onIonInput={onInput}
      inputMode='numeric'
    />
  )
}
