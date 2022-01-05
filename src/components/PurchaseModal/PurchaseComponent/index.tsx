import { IonItemDivider, IonLabel } from '@ionic/react'
import { useRef } from 'react'
import { Control, FieldError, UseFormRegister, useFormState } from 'react-hook-form'
import { FormValues } from '../usePurchaseModal'
import { Member } from '../../../App/types'
import { useSetFocus } from '../../../hooks/useSetFocus'
import { Checkbox } from '../../formComponents/Checkbox'
import { CurrencyInput } from '../../formComponents/CurrencyInput'
import { Select } from '../../formComponents/Select'
import { TextInput } from '../../formComponents/TextInput'

interface PurchaseComponentProps {
  register: UseFormRegister<FormValues>
  control: Control<FormValues>
  groupMembers: Member[]
  membersWithoutPurchaser: Member[]
  isPurchaseSelected: boolean
}

export const PurchaseComponent = ({
  register,
  control,
  groupMembers,
  membersWithoutPurchaser,
  isPurchaseSelected,
}: PurchaseComponentProps): JSX.Element => {
  const { errors } = useFormState({ control, name: ['name', 'amount', 'purchaserId', 'beneficiaryIds'] })
  const nameRef = useRef<HTMLIonInputElement | null>(null)
  const { ref: firstInputRef, ...firstInputRest } = register('name')

  useSetFocus(nameRef, 500, isPurchaseSelected)

  return (
    <>
      <IonItemDivider color='medium'>
        <IonLabel>Einkauf</IonLabel>
      </IonItemDivider>
      <TextInput
        label='Einkaufname'
        placeholder='Name eingeben'
        error={errors.name}
        ref={event => {
          firstInputRef(event)
          nameRef.current = event
        }}
        {...firstInputRest}
      />
      <CurrencyInput label='Betrag' name='amount' control={control} error={errors.amount} />
      <Select
        label='Einkäufer'
        placeholder='Einkäufer auswählen'
        selectOptions={groupMembers}
        error={errors.purchaserId}
        {...register('purchaserId')}
      />
      <Select
        label='Begünstigte'
        placeholder='Begünstigte auswählen'
        selectOptions={membersWithoutPurchaser}
        error={errors.beneficiaryIds as FieldError | undefined}
        {...register('beneficiaryIds')}
        multipleSelect
      />
      <Checkbox
        label='Bezahlt der Einkäufer nur für Andere?'
        name='isPurchaserOnlyPaying'
        control={control}
        lines='none'
      />
    </>
  )
}
