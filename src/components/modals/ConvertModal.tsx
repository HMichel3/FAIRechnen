import { IonInput, IonText } from '@ionic/react'
import { useState } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { parseCommaNumber } from '../../utils/common'
import { displayCurrencyValue } from '../../utils/display'
import { CurrencyInput } from '../ui/noFormComponents/CurrencyInput'
import { NumberInput } from '../ui/noFormComponents/NumberInput'
import { AlertModal } from './AlertModal'

type ConvertModalProps = {
  onSubmit: (amount: number) => void
  onDismiss: () => void
}

export const ConvertModal = ({ onSubmit, onDismiss }: ConvertModalProps) => {
  const { id: groupId, factor = '1' } = useStore(s => s.selectedGroup)
  const setGroupFactor = usePersistedStore(s => s.setGroupFactor)
  const [amount, setAmount] = useState(0)

  return (
    <>
      <AlertModal.Header title='Betrag umrechnen' />
      <AlertModal.Body>
        <CurrencyInput label='Betrag' value={amount} onChange={setAmount} />
        <NumberInput label='Umrechnungsfaktor' value={factor} onChange={value => setGroupFactor(groupId, value)} />
        <IonInput
          fill='solid'
          labelPlacement='floating'
          label='Wert'
          value={displayCurrencyValue(amount * parseCommaNumber(factor))}
          readonly
        />
        <div className='mt-2'>
          <IonText className='text-sm text-neutral-400'>
            Dein Umrechnungsfaktor wird als Vorschlag für diese Gruppe gemerkt.
          </IonText>
        </div>
      </AlertModal.Body>
      <AlertModal.Footer
        onDismiss={onDismiss}
        onSubmit={() => onSubmit(Math.round(amount * parseCommaNumber(factor)))}
      />
    </>
  )
}
