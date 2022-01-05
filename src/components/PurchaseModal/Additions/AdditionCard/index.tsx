import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react'
import { AnimatePresence, motion } from 'framer-motion'
import { chevronDownSharp, chevronUpSharp, trashBinSharp } from 'ionicons/icons'
import { isEmpty, path } from 'ramda'
import { Dispatch, RefObject, SetStateAction } from 'react'
import { Control, UseFormRegister } from 'react-hook-form'
import { FormValues } from '../../usePurchaseModal'
import { fadeInOutTopVariants, variantProps } from '../../../../App/animations'
import { Addition, Member } from '../../../../App/types'
import { displayCurrencyValue } from '../../../../App/utils'
import { CurrencyInput } from '../../../formComponents/CurrencyInput'
import { Select } from '../../../formComponents/Select'
import { TextInput } from '../../../formComponents/TextInput'
import { useAdditionCard } from './useAdditionCard'

export interface AdditionCardProps {
  addition: Addition
  index: number
  register: UseFormRegister<FormValues>
  control: Control<FormValues>
  groupMembers: Member[]
  setShowDeleteAdditionAlert: Dispatch<SetStateAction<boolean>>
  setDeleteAdditionIndex: Dispatch<SetStateAction<number | null>>
  pageContentRef: RefObject<HTMLIonContentElement>
}

export const AdditionCard = ({
  addition,
  index,
  register,
  control,
  groupMembers,
  setShowDeleteAdditionAlert,
  setDeleteAdditionIndex,
  pageContentRef,
}: AdditionCardProps): JSX.Element => {
  const {
    showCardContent,
    firstInputRef,
    firstInputRest,
    additionNameRef,
    errors,
    onToggleShowCardContent,
    onDeleteAddition,
  } = useAdditionCard({
    addition,
    index,
    register,
    control,
    setShowDeleteAdditionAlert,
    setDeleteAdditionIndex,
    pageContentRef,
  })

  return (
    <IonCard>
      <IonCardTitle className='ion-padding-start' onClick={onToggleShowCardContent}>
        <IonItem lines='none'>
          <IonIcon
            className='list-item-icon-color'
            style={{ marginRight: 5 }}
            icon={showCardContent ? chevronUpSharp : chevronDownSharp}
          />
          <IonLabel>{isEmpty(addition.name) ? 'Zusatz' : addition.name}</IonLabel>
          <IonButtons slot='end'>
            <IonText style={{ marginRight: 10 }}>{displayCurrencyValue(addition.amount)}</IonText>
            <IonButton onClick={onDeleteAddition}>
              <IonIcon slot='icon-only' icon={trashBinSharp} />
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonCardTitle>
      <AnimatePresence exitBeforeEnter>
        {showCardContent && (
          <motion.div variants={fadeInOutTopVariants} {...variantProps}>
            <IonCardContent style={{ paddingTop: 0 }}>
              <TextInput
                label='Zusatzname'
                placeholder='Name eingeben'
                error={path(['additions', index, 'name'], errors)}
                ref={event => {
                  firstInputRef(event)
                  additionNameRef.current = event
                }}
                {...firstInputRest}
              />
              <CurrencyInput
                label='Betrag'
                name={`additions.${index}.amount`}
                control={control}
                error={path(['additions', index, 'amount'], errors)}
              />
              <Select
                label='Betroffene'
                placeholder='Betroffene auswählen'
                selectOptions={groupMembers}
                error={path(['additions', index, 'beneficiaryIds'], errors)}
                {...register(`additions.${index}.beneficiaryIds`)}
                multipleSelect
                lines='none'
              />
            </IonCardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </IonCard>
  )
}
