import { IonContent } from '@ionic/react'
import { map, pick, prop } from 'ramda'
import { useForm } from 'react-hook-form'
import { NewIncome } from '../../App/types'
import { Income, Member } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { FormCheckboxGroup } from '../formComponents/FormCheckboxGroup'
import { FormChipsComponent } from '../formComponents/FormChipsComponent'
import { FormComponent } from '../formComponents/FormComponent'
import { FormCurrency } from '../formComponents/FormCurrency'
import { FormInput } from '../formComponents/FormInput'
import { FormRadioGroup } from '../formComponents/FormRadioGroup'
import { FormTextarea } from '../formComponents/FormTextarea'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
  const { handleSubmit, formState, control } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(members, selectedIncome),
  })

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
    <form className='flex-column-full-height' onSubmit={onSubmit}>
      <ModalHeader title={selectedIncome ? 'Einkommen bearbeiten' : 'Neues Einkommen'} onDismiss={onDismiss} />
      <IonContent>
        <FormComponent label='Einkommenname*' error={formState.errors.name}>
          <FormInput name='name' control={control} />
        </FormComponent>
        <FormComponent label='Betrag*' error={formState.errors.amount}>
          <FormCurrency name='amount' control={control} />
        </FormComponent>
        <FormChipsComponent label='Verdiener*'>
          <FormRadioGroup name='earnerId' control={control} selectOptions={members} />
        </FormChipsComponent>
        <FormChipsComponent label='Beteiligte*' error={formState.errors.beneficiaryIds}>
          <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={members} />
        </FormChipsComponent>
        <FormComponent label='Beschreibung'>
          <FormTextarea name='description' control={control} />
        </FormComponent>
      </IonContent>
      <ModalFooter>Einkommen speichern</ModalFooter>
    </form>
  )
}
