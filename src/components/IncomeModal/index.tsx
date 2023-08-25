import { IonContent, IonLabel } from '@ionic/react'
import { isEmpty, map, pick, prop } from 'ramda'
import { useForm } from 'react-hook-form'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { FormCheckboxGroup } from '../formComponents/FormCheckboxGroup'
import { FormCurrency } from '../formComponents/FormCurrency'
import { FormInput } from '../formComponents/FormInput'
import { FormRadioGroup } from '../formComponents/FormRadioGroup'
import { FormTextarea } from '../formComponents/FormTextarea'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NewIncome } from '../../App/types'
import { Income, Member } from '../../stores/types'
import { cn } from '../../App/utils'
import { Show } from '../SolidComponents/Show'
import { ConvertModal } from '../PurchaseModal/PurchaseSegment/ConvertModal'
import { useState } from 'react'
import { ConvertButton } from '../PurchaseModal/PurchaseSegment/ConvertButton'

export type IncomeFormPropertyName = 'name' | 'amount' | 'earnerId' | 'beneficiaryIds' | 'description'

interface IncomeModalProps {
  onDismiss: () => void
  selectedIncome?: Income
}

const validationSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  earnerId: z.string().min(1),
  beneficiaryIds: z.string().array().nonempty(),
  description: z.string(),
})

const defaultValues = (members: Member[], selectedIncome?: Income): NewIncome => {
  if (!selectedIncome) {
    const memberIds = map(prop('id'), members)
    return {
      name: '',
      amount: 0,
      earnerId: memberIds.at(0)!,
      beneficiaryIds: memberIds,
      description: '',
    }
  }

  return pick(['name', 'amount', 'earnerId', 'beneficiaryIds', 'description'], selectedIncome)
}

export const IncomeModal = ({ onDismiss, selectedIncome }: IncomeModalProps): JSX.Element => {
  const { id: groupId, members } = useStore(s => s.selectedGroup)
  const addIncome = usePersistedStore(s => s.addIncome)
  const editIncome = usePersistedStore(s => s.editIncome)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const { handleSubmit, formState, control, setValue } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedIncome),
  })
  const [showConvertModal, setShowConvertModal] = useState<IncomeFormPropertyName | ''>('')

  const onSubmit = handleSubmit(newIncome => {
    if (selectedIncome) {
      editIncome(groupId, selectedIncome.id, newIncome)
    } else {
      addIncome(groupId, newIncome)
    }
    setShowAnimation()
    onDismiss()
  })

  return (
    <form className='flex flex-1 flex-col' onSubmit={onSubmit}>
      <ModalHeader title={selectedIncome ? 'Einkommen bearbeiten' : 'Neues Einkommen'} onDismiss={onDismiss} />
      <IonContent>
        <div className='my-2 flex flex-col gap-2'>
          <FormInput label='Einkommenname*' name='name' control={control} />
          <div className='flex'>
            <FormCurrency label='Betrag*' name='amount' control={control} />
            <ConvertButton onClick={() => setShowConvertModal('amount')} />
          </div>
          <div className='flex flex-col border-b border-[#898989] bg-[#1e1e1e] px-4 py-2'>
            <IonLabel className='text-xs'>Verdiener*</IonLabel>
            <FormRadioGroup name='earnerId' control={control} selectOptions={members} />
          </div>
          <div
            className={cn('flex flex-col border-b border-[#898989] bg-[#1e1e1e] px-4 py-2', {
              'border-[#eb445a]': formState.errors.beneficiaryIds,
            })}
          >
            <IonLabel className='text-xs' color={cn({ danger: formState.errors.beneficiaryIds })}>
              Beteiligte*
            </IonLabel>
            <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={members} />
          </div>
          <FormTextarea label='Beschreibung' name='description' control={control} />
        </div>
      </IonContent>
      <ModalFooter>Einkommen speichern</ModalFooter>
      <Show when={!isEmpty(showConvertModal)}>
        <ConvertModal
          setFormAmount={amount => setValue(showConvertModal as IncomeFormPropertyName, amount)}
          onDismiss={() => setShowConvertModal('')}
        />
      </Show>
    </form>
  )
}
