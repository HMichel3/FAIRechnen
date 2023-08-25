import { IonButton, IonCard, IonCardContent, IonCardTitle, IonIcon, IonLabel, useIonAlert } from '@ionic/react'
import { AnimatePresence, motion } from 'framer-motion'
import { chevronDownSharp, chevronUpSharp, trashBinSharp } from 'ionicons/icons'
import { isEmpty, isNotNil, path, trim } from 'ramda'
import { Dispatch, SetStateAction, useState } from 'react'
import { fadeInOutTopVariants, variantProps } from '../../../../App/animations'
import { cn, displayCurrencyValue } from '../../../../App/utils'
import { FormInput } from '../../../formComponents/FormInput'
import { FormCurrency } from '../../../formComponents/FormCurrency'
import { Control, FieldError, FieldErrorsImpl, Merge, UseFieldArrayRemove, useWatch } from 'react-hook-form'
import { FormCheckboxGroup } from '../../../formComponents/FormCheckboxGroup'
import { ConvertButton } from '../../PurchaseSegment/ConvertButton'
import { PurchaseFormPropertyName } from '../..'
import { NewPurchase } from '../../../../App/types'
import { SelectedGroup } from '../../../../stores/types'

interface AdditionCardProps {
  index: number
  control: Control<NewPurchase>
  members: SelectedGroup['members']
  setShowConvertModal: Dispatch<SetStateAction<PurchaseFormPropertyName | ''>>
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
}: AdditionCardProps): JSX.Element => {
  const [presentDeleteAddition] = useIonAlert()
  const { name, amount } = useWatch({ control, name: `additions.${index}` })
  const isNameEmptyOrHasAdditionError = isEmpty(name) || isNotNil(path([index], additionErrors))
  const [showCardContent, setShowCardContent] = useState(isNameEmptyOrHasAdditionError)

  const onToggleShowCardContent = () => {
    setShowCardContent(prevState => !prevState)
  }

  const onDeleteAddition = (additionIndex: number) => {
    presentDeleteAddition({
      header: 'Wollen Sie den Zusatz wirklich löschen?',
      buttons: [
        { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
        { role: 'confirm', text: 'Löschen', handler: () => remove(additionIndex) },
      ],
    })
  }

  return (
    <IonCard>
      <IonCardTitle className='mx-3 flex items-center justify-between gap-2'>
        <IonIcon icon={showCardContent ? chevronUpSharp : chevronDownSharp} onClick={onToggleShowCardContent} />
        <IonLabel className='flex-1 text-base' onClick={onToggleShowCardContent}>
          {isEmpty(trim(name)) ? 'Zusatz' : name}
        </IonLabel>
        <IonLabel className='text-base' onClick={onToggleShowCardContent}>
          {displayCurrencyValue(amount)}
        </IonLabel>
        <IonButton className='mr-1' fill='clear' onClick={() => onDeleteAddition(index)}>
          <IonIcon color='danger' slot='icon-only' icon={trashBinSharp} />
        </IonButton>
      </IonCardTitle>
      <AnimatePresence mode='wait'>
        {showCardContent && (
          <motion.div variants={fadeInOutTopVariants} {...variantProps}>
            <IonCardContent className='flex flex-col gap-2 py-0 text-white'>
              <FormInput label='Zusatzname*' name={`additions.${index}.name`} control={control} />
              <div className='flex'>
                <FormCurrency label='Betrag*' name={`additions.${index}.amount`} control={control} />
                <ConvertButton onClick={() => setShowConvertModal(`additions.${index}.amount`)} />
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
    </IonCard>
  )
}
