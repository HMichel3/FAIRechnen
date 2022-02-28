import { IonItem, IonLabel } from '@ionic/react'
import { path } from 'ramda'
import { Income } from '../../App/types'
import { removeItemsById } from '../../App/utils'
import { ButtonWithSaveIcon } from '../ButtonWithSaveIcon'
import { FormCheckbox } from '../formComponents/FormCheckbox'
import { FormComponent } from '../formComponents/FormComponent'
import { FormCurrency } from '../formComponents/FormCurrency'
import { FormInput } from '../formComponents/FormInput'
import { FormSelect } from '../formComponents/FormSelect'
import { FormTextarea } from '../formComponents/FormTextarea'
import { PageContent } from '../PageLayout/PageContent'
import { PageFooter } from '../PageLayout/PageFooter'
import { PageHeader } from '../PageLayout/PageHeader'
import { useIncomeModal } from './useIncomeModal'

export interface IncomeModalProps {
  onDismiss: () => void
  selectedIncome?: Income
}

export const IncomeModal = ({ onDismiss, selectedIncome }: IncomeModalProps): JSX.Element => {
  const { onSubmit, errors, control, groupMembers, watch } = useIncomeModal({ onDismiss, selectedIncome })
  const membersWithoutEarner = removeItemsById(watch('earnerId'), groupMembers, 'memberId')

  return (
    <form className='flex-column-full-height' onSubmit={onSubmit}>
      <PageHeader title={selectedIncome ? 'Einkommen bearbeiten' : 'Neues Einkommen'} onCloseButton={onDismiss} />
      <PageContent>
        <FormComponent label='Einkommenname*' error={errors.name}>
          <FormInput name='name' control={control} />
        </FormComponent>
        <FormComponent label='Betrag*' error={errors.amount}>
          <FormCurrency name='amount' control={control} />
        </FormComponent>
        <FormComponent label='Verdiener*' error={errors.earnerId}>
          <FormSelect name='earnerId' control={control} selectOptions={groupMembers} />
        </FormComponent>
        <FormComponent label='Beteiligte*' error={path(['beneficiaryIds'], errors)}>
          <FormSelect name='beneficiaryIds' control={control} selectOptions={membersWithoutEarner} multiple />
        </FormComponent>
        <IonItem className='form-input-margin' fill='outline' color='light' lines='none'>
          <IonLabel color='light'>Bekommen die Beteiligten alles?</IonLabel>
          <FormCheckbox name='isEarnerOnlyEarning' control={control} />
        </IonItem>
        <FormComponent label='Beschreibung'>
          <FormTextarea name='description' control={control} />
        </FormComponent>
      </PageContent>
      <PageFooter>
        <ButtonWithSaveIcon type='submit'>Einkommen speichern</ButtonWithSaveIcon>
      </PageFooter>
    </form>
  )
}
