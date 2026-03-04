import { IonCard, IonCardContent, IonCardTitle, IonLabel } from '@ionic/react'
import { calculatorSharp, chevronDownSharp, chevronUpSharp, closeCircleSharp } from 'ionicons/icons'
import { AnimatePresence, motion } from 'motion/react'
import { isEmpty, isNotNil, path, trim } from 'ramda'
import { useState } from 'react'
import { Control, FieldError, FieldErrorsImpl, Merge, UseFieldArrayRemove, useWatch } from 'react-hook-form'
import { isEmptyish } from 'remeda'
import { useOverlay } from '../../hooks/useOverlay'
import { PurchaseFormPropertyName } from '../../pages/PurchasePage'
import { NewPurchase } from '../../types/common'
import { SelectedGroup } from '../../types/store'
import { fadeInOutTopVariants } from '../../utils/animation'
import { cn, displayCurrencyValue } from '../../utils/common'
import { DeleteAlert } from '../alerts/DeleteAlert'
import { FormCheckboxGroup } from '../ui/formComponents/FormCheckboxGroup'
import { FormCurrency } from '../ui/formComponents/FormCurrency'
import { FormInput } from '../ui/formComponents/FormInput'
import { IconButton } from '../ui/IconButton'

type AdditionCardProps = {
  index: number
  control: Control<NewPurchase>
  members: SelectedGroup['members']
  setShowConvertModal: (value: PurchaseFormPropertyName) => void
  remove: UseFieldArrayRemove
  additionErrors?: Merge<
    FieldError,
    (
      | Merge<
          FieldError,
          FieldErrorsImpl<{
            name: string
            amount: number
            payerIds: string[]
          }>
        >
      | undefined
    )[]
  >
}

export const AdditionCard = ({
  index,
  control,
  members,
  additionErrors,
  setShowConvertModal,
  remove,
}: AdditionCardProps) => {
  const deleteAdditionOverlay = useOverlay<{ id: number; name: string }>()
  const { name, amount } = useWatch({ control, name: `additions.${index}` })
  const isNameEmptyOrHasAdditionError = isEmpty(name) || isNotNil(path([index], additionErrors))
  const [showCardContent, setShowCardContent] = useState(isNameEmptyOrHasAdditionError)

  const onToggleShowCardContent = () => {
    setShowCardContent(prevState => !prevState)
  }

  const onDeleteAddition = (additionIndex: number) => {
    if (isEmptyish(name)) {
      remove(additionIndex)
      return
    }
    deleteAdditionOverlay.onSelect({ id: additionIndex, name })
  }

  return (
    <IonCard>
      <IonCardTitle className='flex items-center justify-between gap-2 px-4 py-2'>
        <IconButton icon={showCardContent ? chevronUpSharp : chevronDownSharp} onClick={onToggleShowCardContent} />
        <IonLabel className='flex-1 text-base' onClick={onToggleShowCardContent}>
          {isEmpty(trim(name)) ? 'Zusatz' : name}
        </IonLabel>
        <IonLabel className='text-base' onClick={onToggleShowCardContent}>
          {displayCurrencyValue(amount)}
        </IonLabel>
        <IconButton icon={closeCircleSharp} color='danger' onClick={() => onDeleteAddition(index)} />
      </IonCardTitle>
      <AnimatePresence mode='wait'>
        {showCardContent && (
          <motion.div {...fadeInOutTopVariants}>
            <IonCardContent className='flex flex-col gap-2 py-0 text-base text-white'>
              <FormInput label='Zusatzname*' name={`additions.${index}.name`} control={control} />
              <div className='flex'>
                <FormCurrency label='Betrag*' name={`additions.${index}.amount`} control={control} />
                <IconButton icon={calculatorSharp} onClick={() => setShowConvertModal(`additions.${index}.amount`)} />
              </div>
              <div className='flex flex-col px-4 py-2'>
                <IonLabel className='text-xs' color={cn({ danger: path([index, 'payerIds'], additionErrors) })}>
                  Beteiligte*
                </IonLabel>
                <FormCheckboxGroup name={`additions.${index}.payerIds`} selectOptions={members} control={control} />
              </div>
            </IonCardContent>
          </motion.div>
        )}
      </AnimatePresence>
      <DeleteAlert
        overlay={deleteAdditionOverlay}
        onDelete={remove}
        message='Dieser Zusatz wird unwiderruflich entfernt.'
      />
    </IonCard>
  )
}
