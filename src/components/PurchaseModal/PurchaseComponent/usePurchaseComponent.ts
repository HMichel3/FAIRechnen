import { includes, isEmpty, without } from 'ramda'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export const usePurchaseComponent = () => {
  const { control, watch, setValue, formState } = useFormContext()

  useEffect(() => {
    const adjustBeneficiaryIds = watch(({ purchaserId, beneficiaryIds }, { name }) => {
      if (name !== 'purchaserId' || isEmpty(purchaserId) || !includes(purchaserId, beneficiaryIds)) return
      setValue('beneficiaryIds', without([purchaserId], beneficiaryIds))
    })
    return () => adjustBeneficiaryIds.unsubscribe()
  }, [watch, setValue])

  return { control, watch, errors: formState.errors }
}
