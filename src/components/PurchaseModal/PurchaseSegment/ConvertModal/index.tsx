import { IonButton, IonInput } from '@ionic/react'
import { useState } from 'react'
import { CurrencyInput } from '../../../noFormComponents/CurrencyInput'
import { NumberInput } from '../../../noFormComponents/NumberInput'
import { displayCurrencyValue } from '../../../../App/utils'
import { FormComponent } from '../../../formComponents/FormComponent'
import { UseFormSetValue } from 'react-hook-form'
import './index.scss'

interface ConvertModalProps {
  setValue: UseFormSetValue<NewPurchase>
  onDismiss: () => void
}

export const ConvertModal = ({ setValue, onDismiss }: ConvertModalProps) => {
  const [amount, setAmount] = useState(0)
  const [factor, setFactor] = useState(1)

  function onSave() {
    setValue('amount', Math.round(Math.abs(amount * factor)))
    onDismiss()
  }

  return (
    <>
      <div className='custom-backdrop full-view' onClick={onDismiss} />
      <div className='convert-modal'>
        <div className='content'>
          <h3>Betrag umrechnen</h3>
          <div>
            <FormComponent label='Betrag'>
              <CurrencyInput value={amount} onChange={setAmount} />
            </FormComponent>
            <FormComponent label='Umrechnungsfaktor'>
              <NumberInput value={factor} onChange={setFactor} />
            </FormComponent>
            <FormComponent label='Wert'>
              <IonInput readonly>{displayCurrencyValue(amount * factor)}</IonInput>
            </FormComponent>
          </div>
          <IonButton className='default-margin' type='button' color='medium' onClick={onSave}>
            Übernehmen
          </IonButton>
        </div>
      </div>
    </>
  )
}
