import { IonButton, IonCard, IonCardContent, IonCardTitle, IonIcon, IonItem, IonLabel } from '@ionic/react'
import { AnimatePresence, motion } from 'framer-motion'
import { chevronDownSharp, chevronUpSharp, trashBinSharp } from 'ionicons/icons'
import { isEmpty, path } from 'ramda'
import { Dispatch, RefObject, SetStateAction } from 'react'
import { fadeInOutTopVariants, variantProps } from '../../../../App/animations'
import { displayCurrencyValue } from '../../../../App/utils'
import { FormInput } from '../../../formComponents/FormInput'
import { FormComponent } from '../../../formComponents/FormComponent'
import { FormCurrency } from '../../../formComponents/FormCurrency'
import { FormSelect } from '../../../formComponents/FormSelect'
import { useStore } from '../../../../stores/useStore'
import { useFormContext } from 'react-hook-form'
import { useToggle } from '../../../../hooks/useToggle'
import './index.scss'

export interface AdditionCardProps {
  index: number
  pageContentRef: RefObject<HTMLIonContentElement>
  setAdditionIndex: Dispatch<SetStateAction<number | null>>
}

export const AdditionCard = ({ index, pageContentRef, setAdditionIndex }: AdditionCardProps): JSX.Element => {
  const { control, watch, formState } = useFormContext()
  const [showCardContent, toggleShowCardContent] = useToggle(isEmpty(watch(`additions.${index}.name`)))
  const { groupMembers } = useStore.useSelectedGroup()
  const additionName = watch(`additions.${index}.name`)
  const additionAmount = watch(`additions.${index}.amount`)

  const onToggleShowCardContent = () => {
    toggleShowCardContent()
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  const onClickDelete = () => {
    // undo setShowCardContent from the onClick on IonCardTitle
    toggleShowCardContent()
    setAdditionIndex(index)
  }

  return (
    <IonCard className='form-input-margin'>
      <IonCardTitle onClick={onToggleShowCardContent}>
        <IonItem lines='none'>
          <IonIcon
            slot='start'
            className='list-item-icon-color'
            icon={showCardContent ? chevronUpSharp : chevronDownSharp}
            style={{ marginInlineEnd: 12 }}
          />
          <IonLabel>{isEmpty(additionName) ? 'Zusatz' : additionName}</IonLabel>
          <IonLabel color='light' slot='end' style={{ marginInlineStart: 16 }}>
            {displayCurrencyValue(additionAmount)}
          </IonLabel>
          <IonButton
            slot='end'
            fill='clear'
            onClick={onClickDelete}
            style={{ marginInlineStart: 8, marginInlineEnd: -5 }}
          >
            <IonIcon color='danger' slot='icon-only' icon={trashBinSharp} />
          </IonButton>
        </IonItem>
      </IonCardTitle>
      <AnimatePresence exitBeforeEnter>
        {showCardContent && (
          <motion.div variants={fadeInOutTopVariants} {...variantProps}>
            <IonCardContent style={{ paddingTop: 0 }}>
              <FormComponent
                className='addition-card-input'
                label='Zusatzname'
                error={path(['additions', index, 'name'], formState.errors)}
                noMargin
              >
                <FormInput name={`additions.${index}.name`} control={control} />
              </FormComponent>
              <FormComponent
                className='addition-card-input'
                label='Betrag'
                error={path(['additions', index, 'amount'], formState.errors)}
                noMargin
              >
                <FormCurrency name={`additions.${index}.amount`} control={control} />
              </FormComponent>
              <FormComponent
                className='addition-card-select'
                label='Beteiligte'
                error={path(['additions', index, 'beneficiaryIds'], formState.errors)}
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
