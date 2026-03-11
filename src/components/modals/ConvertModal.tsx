import { IonInput, IonText } from '@ionic/react'
import { useState } from 'react'
import { GroupData } from '../../hooks/useGroupData'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { parseCommaNumber } from '../../utils/common'
import { displayCurrencyValue } from '../../utils/display'
import { CurrencyInput } from '../ui/noFormComponents/CurrencyInput'
import { NumberInput } from '../ui/noFormComponents/NumberInput'
import { AlertModal } from './AlertModal'

type ConvertModalProps = {
  groupData: GroupData
  onSubmit: (amount: number) => void
  onDismiss: () => void
}

export const ConvertModal = ({ groupData, onSubmit, onDismiss }: ConvertModalProps) => {
  const setGroupFactor = usePersistedStore(s => s.setGroupFactor)
  const [amount, setAmount] = useState(0)

  return (
    <>
      <AlertModal.Header title='Betrag umrechnen' />
      <AlertModal.Body>
        <CurrencyInput label='Betrag' value={amount} onChange={setAmount} />
        <NumberInput
          label='Umrechnungsfaktor'
          value={groupData.factor}
          onChange={value => setGroupFactor(groupData.id, value)}
        />
        <IonInput
          fill='solid'
          labelPlacement='floating'
          label='Wert'
          value={displayCurrencyValue(amount * parseCommaNumber(groupData.factor))}
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
        onSubmit={() => onSubmit(Math.round(amount * parseCommaNumber(groupData.factor)))}
      />
    </>
  )
}
