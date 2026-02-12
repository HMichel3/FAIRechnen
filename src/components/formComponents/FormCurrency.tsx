import { IonInput } from '@ionic/react'
import { isNotNil, toString } from 'ramda'
import { useRef } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { cn, displayCurrencyValue } from '../../App/utils'

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

export const FormCurrency = <T extends FieldValues>({
  label,
  name,
  control,
  className,
}: FormCurrencyProps<T>): JSX.Element => {
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name, control })
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
      inputComponent.value = displayCurrencyValue(value)
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
      onIonInput={onKeyDown}
      inputMode='numeric'
    />
  )
}
