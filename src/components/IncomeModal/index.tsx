import { IonContent } from '@ionic/react'
import { path } from 'ramda'
import { Income } from '../../App/types'
import { FormCheckboxGroup } from '../formComponents/FormCheckboxGroup'
import { FormChipsComponent } from '../formComponents/FormChipsComponent'
import { FormComponent } from '../formComponents/FormComponent'
import { FormCurrency } from '../formComponents/FormCurrency'
import { FormInput } from '../formComponents/FormInput'
import { FormRadioGroup } from '../formComponents/FormRadioGroup'
import { FormTextarea } from '../formComponents/FormTextarea'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { useIncomeModal } from './useIncomeModal'

export interface IncomeModalProps {
  onDismiss: () => void
  selectedIncome?: Income
}

export const IncomeModal = ({ onDismiss, selectedIncome }: IncomeModalProps): JSX.Element => {
  const { onSubmit, errors, control, groupMembers } = useIncomeModal({ onDismiss, selectedIncome })

  return (
    <form className='flex-column-full-height' onSubmit={onSubmit}>
      <ModalHeader onDismiss={onDismiss}>{selectedIncome ? 'Einkommen bearbeiten' : 'Neues Einkommen'}</ModalHeader>
      <IonContent>
        <FormComponent label='Einkommenname*' error={errors.name}>
          <FormInput name='name' control={control} />
        </FormComponent>
        <FormComponent label='Betrag*' error={errors.amount}>
          <FormCurrency name='amount' control={control} />
        </FormComponent>
        <FormChipsComponent label='Verdiener*'>
          <FormRadioGroup name='earnerId' control={control} selectOptions={groupMembers} />
        </FormChipsComponent>
        <FormChipsComponent label='Beteiligte*' error={path(['beneficiaryIds'], errors)}>
          <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={groupMembers} />
        </FormChipsComponent>
        <FormComponent label='Beschreibung'>
          <FormTextarea name='description' control={control} />
        </FormComponent>
      </IonContent>
      <ModalFooter>Einkommen speichern</ModalFooter>
    </form>
  )
}
