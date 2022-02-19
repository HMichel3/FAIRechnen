import { IonItem, IonItemDivider, IonLabel } from '@ionic/react'
import { FormComponent } from '../../formComponents/FormComponent'
import { FormInput } from '../../formComponents/FormInput'
import { FormCurrency } from '../../formComponents/FormCurrency'
import { FormSelect } from '../../formComponents/FormSelect'
import { FormCheckbox } from '../../formComponents/FormCheckbox'
import { path } from 'ramda'
import { useStore } from '../../../stores/useStore'
import { usePurchaseComponent } from './usePurchaseComponent'
import { removeItemById } from '../../../App/utils'

export const PurchaseComponent = (): JSX.Element => {
  const { control, watch, errors } = usePurchaseComponent()
  const { groupMembers } = useStore.useSelectedGroup()
  const membersWithoutPurchaser = removeItemById(watch('purchaserId'), groupMembers, 'memberId')

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
        <IonLabel color='light'>Bezahlen die Begünstigten alles?</IonLabel>
        <FormCheckbox name='isPurchaserOnlyPaying' control={control} />
      </IonItem>
    </>
  )
}
