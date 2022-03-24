import { IonItemDivider, IonLabel } from '@ionic/react'
import { FormComponent } from '../../formComponents/FormComponent'
import { FormInput } from '../../formComponents/FormInput'
import { FormCurrency } from '../../formComponents/FormCurrency'
import { path } from 'ramda'
import { useStore } from '../../../stores/useStore'
import { FormTextarea } from '../../formComponents/FormTextarea'
import { FormRadioGroup } from '../../formComponents/FormRadioGroup'
import { FormChipsComponent } from '../../formComponents/FormChipsComponent'
import { FormCheckboxGroup } from '../../formComponents/FormCheckboxGroup'
import { Control, useFormState } from 'react-hook-form'
import { NewPurchase } from '../../../App/types'

interface PurchaseComponentProps {
  control: Control<NewPurchase>
}

export const PurchaseComponent = ({ control }: PurchaseComponentProps): JSX.Element => {
  const { members } = useStore.useSelectedGroup()
  const { errors } = useFormState({ control })

  return (
    <div className='purchase-component'>
      <IonItemDivider color='medium'>
        <IonLabel>Einkauf</IonLabel>
      </IonItemDivider>
      <FormComponent label='Einkaufname*' error={errors.name}>
        <FormInput name='name' control={control} />
      </FormComponent>
      <FormComponent label='Betrag*' error={errors.amount}>
        <FormCurrency name='amount' control={control} />
      </FormComponent>
      <FormChipsComponent label='Einkäufer*'>
        <FormRadioGroup name='purchaserId' control={control} selectOptions={members} />
      </FormChipsComponent>
      <FormChipsComponent label='Begünstigte*' error={path(['beneficiaryIds'], errors)}>
        <FormCheckboxGroup name='beneficiaryIds' control={control} selectOptions={members} />
      </FormChipsComponent>
      <FormComponent label='Beschreibung'>
        <FormTextarea name='description' control={control} />
      </FormComponent>
    </div>
  )
}
