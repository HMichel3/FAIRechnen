import { IonInput } from '@ionic/react'
import { toString } from 'ramda'
import { useCallback } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { displayCurrencyValue } from '../../App/utils'

interface FormCurrencyProps<Type> {
  name: Path<Type>
  control: Control<Type>
}

const VALID_FIRST = /^[1-9]{1}$/
const VALID_NEXT = /^[0-9]{1}$/
const DELETE_INPUT = 'deleteContentBackward'
const MAX = Number.MAX_SAFE_INTEGER

export const FormCurrency = <Type extends FieldValues>({ name, control }: FormCurrencyProps<Type>): JSX.Element => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  const valueAbsTrunc = Math.trunc(Math.abs(value))

  if (value !== valueAbsTrunc || !Number.isFinite(value) || Number.isNaN(value)) {
    throw new Error(`invalid value property`)
  }

  const onKeyDown = useCallback(
    (event: CustomEvent): void => {
      const { data, inputType } = event.detail
      if (
        (value === 0 && !VALID_FIRST.test(data)) ||
        (value !== 0 && !VALID_NEXT.test(data) && inputType !== DELETE_INPUT)
      )
        return

      const valueString = toString(value)
      let nextValue: number

      if (inputType !== DELETE_INPUT) {
        const nextValueString: string = value === 0 ? data : `${valueString}${data}`
        nextValue = Number.parseInt(nextValueString, 10)
      } else {
        const nextValueString = valueString.slice(0, -1)
        nextValue = nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10)
      }

      if (nextValue > MAX) return

      onChange(nextValue)
    },
    [onChange, value]
  )

  return <IonInput value={displayCurrencyValue(value)} onIonInput={onKeyDown} inputMode='numeric' />
}
