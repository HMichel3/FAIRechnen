import { IonButton, IonInput } from '@ionic/react'
import { useState } from 'react'
import { CurrencyInput } from '../../../noFormComponents/CurrencyInput'
import { NumberInput, parseCommaNumber } from '../../../noFormComponents/NumberInput'
import { displayCurrencyValue } from '../../../../App/utils'
import { UseFormSetValue } from 'react-hook-form'
import { FormPropertyName } from '../..'
import { NewPurchase } from '../../../../App/types'

interface ConvertModalProps {
  name: FormPropertyName
  setValue: UseFormSetValue<NewPurchase>
  onDismiss: () => void
}

export const ConvertModal = ({ name, setValue, onDismiss }: ConvertModalProps) => {
  const [amount, setAmount] = useState(0)
  const [factor, setFactor] = useState('1')

  function onSave() {
    setValue(name, Math.round(amount * parseCommaNumber(factor)))
    onDismiss()
  }

  return (
    <>
      <div className='absolute inset-0 z-10 bg-black/60' onClick={onDismiss} />
      <div className='absolute bottom-0 left-4 right-4 top-0 z-20 my-auto h-fit rounded bg-slate-700 p-4'>
        <div className='flex flex-col justify-center'>
          <h3 className='mb-4 text-center text-xl'>Betrag umrechnen</h3>
          <div>
            <CurrencyInput label='Betrag' value={amount} onChange={setAmount} />
            <NumberInput label='Umrechnungsfaktor' value={factor} onChange={setFactor} />
            <IonInput
              fill='solid'
              labelPlacement='floating'
              label='Wert'
              value={displayCurrencyValue(amount * parseCommaNumber(factor))}
              readonly
            />
          </div>
          <IonButton className='mx-0 mt-4' type='button' onClick={onSave}>
            Übernehmen
          </IonButton>
        </div>
      </div>
    </>
  )
}
