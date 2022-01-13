import { IonItem, IonItemDivider, IonLabel } from '@ionic/react'
import { Control, useFormState } from 'react-hook-form'
import { FormValues } from '../usePurchaseModal'
import { Member } from '../../../App/types'
import { FormComponent } from '../../formComponents/FormComponent'
import { FormInput } from '../../formComponents/FormInput'
import { FormCurrency } from '../../formComponents/FormCurrency'
import { FormSelect } from '../../formComponents/FormSelect'
import { FormCheckbox } from '../../formComponents/FormCheckbox'
import { path } from 'ramda'

interface PurchaseComponentProps {
  control: Control<FormValues>
  groupMembers: Member[]
  membersWithoutPurchaser: Member[]
}

export const PurchaseComponent = ({
  control,
  groupMembers,
  membersWithoutPurchaser,
}: PurchaseComponentProps): JSX.Element => {
  const { errors } = useFormState({ control, name: ['name', 'amount', 'purchaserId', 'beneficiaryIds'] })

  return (
    <>
      <IonItemDivider color='medium'>
        <IonLabel>Einkauf</IonLabel>
      </IonItemDivider>
      <FormComponent label='Einkaufname' error={errors.name}>
        <FormInput name='name' control={control} />
      </FormComponent>
      <FormComponent label='Betrag' error={errors.amount}>
        <FormCurrency name='amount' control={control} />
      </FormComponent>
      <FormComponent label='Einkäufer' error={errors.purchaserId}>
        <FormSelect name='purchaserId' control={control} selectOptions={groupMembers} />
      </FormComponent>
      <FormComponent label='Begünstigte' error={path(['beneficiaryIds'], errors)}>
        <FormSelect name='beneficiaryIds' control={control} selectOptions={membersWithoutPurchaser} multiple />
      </FormComponent>
      <IonItem className='form-input-margin' fill='outline' color='light' lines='none'>
        <IonLabel color='light'>Bezahlt der Einkäufer nur für Andere?</IonLabel>
        <FormCheckbox name='isPurchaserOnlyPaying' control={control} />
      </IonItem>
    </>
  )
}
