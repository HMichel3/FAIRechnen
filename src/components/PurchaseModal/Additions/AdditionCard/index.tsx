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
import { Control } from 'react-hook-form'
import { FormValues } from '../../usePurchaseModal'
import { fadeInOutTopVariants, variantProps } from '../../../../App/animations'
import { Addition, Member } from '../../../../App/types'
import { displayCurrencyValue } from '../../../../App/utils'
import { useAdditionCard } from './useAdditionCard'
import { FormInput } from '../../../formComponents/FormInput'
import { FormComponent } from '../../../formComponents/FormComponent'
import { FormCurrency } from '../../../formComponents/FormCurrency'
import { FormSelect } from '../../../formComponents/FormSelect'
import './index.css'

export interface AdditionCardProps {
  addition: Addition
  index: number
  control: Control<FormValues>
  groupMembers: Member[]
  setShowDeleteAdditionAlert: Dispatch<SetStateAction<boolean>>
  setDeleteAdditionIndex: Dispatch<SetStateAction<number | null>>
  pageContentRef: RefObject<HTMLIonContentElement>
}

export const AdditionCard = ({
  addition,
  index,
  control,
  groupMembers,
  setShowDeleteAdditionAlert,
  setDeleteAdditionIndex,
  pageContentRef,
}: AdditionCardProps): JSX.Element => {
  const { showCardContent, errors, onToggleShowCardContent, onDeleteAddition } = useAdditionCard({
    addition,
    index,
    control,
    setShowDeleteAdditionAlert,
    setDeleteAdditionIndex,
    pageContentRef,
  })

  return (
    <IonCard className='form-input-margin'>
      <IonCardTitle onClick={onToggleShowCardContent}>
        <IonItem lines='none'>
          <IonIcon
            className='list-item-icon-color'
            style={{ marginLeft: -1, marginRight: 8 }}
            icon={showCardContent ? chevronUpSharp : chevronDownSharp}
          />
          <IonLabel>{isEmpty(addition.name) ? 'Zusatz' : addition.name}</IonLabel>
          <IonButtons slot='end'>
            <IonText style={{ marginRight: 10 }}>{displayCurrencyValue(addition.amount)}</IonText>
            <IonButton style={{ marginRight: -14 }} onClick={onDeleteAddition}>
              <IonIcon slot='icon-only' icon={trashBinSharp} />
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonCardTitle>
      <AnimatePresence exitBeforeEnter>
        {showCardContent && (
          <motion.div variants={fadeInOutTopVariants} {...variantProps}>
            <IonCardContent style={{ paddingTop: 0 }}>
              <FormComponent
                className='addition-card-input'
                label='Zusatzname'
                error={path(['additions', index, 'name'], errors)}
                noMargin
              >
                <FormInput name={`additions.${index}.name`} control={control} />
              </FormComponent>
              <FormComponent
                className='addition-card-input'
                label='Betrag'
                error={path(['additions', index, 'amount'], errors)}
                noMargin
              >
                <FormCurrency name={`additions.${index}.amount`} control={control} />
              </FormComponent>
              <FormComponent
                className='addition-card-select'
                label='Betroffene'
                error={path(['additions', index, 'beneficiaryIds'], errors)}
                noMargin
              >
                <FormSelect
                  name={`additions.${index}.beneficiaryIds`}
                  selectOptions={groupMembers}
                  control={control}
                  multiple
                />
              </FormComponent>
            </IonCardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </IonCard>
  )
}
