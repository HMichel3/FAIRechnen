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
import { Control, useFormState, useWatch } from 'react-hook-form'
import { useToggle } from '../../../../hooks/useToggle'
import { usePersistedStore } from '../../../../stores/usePersistedStore'
import { isDark } from '../../../../pages/GroupPage/utils'
import clsx from 'clsx'
import { NewPurchase } from '../../../../App/types'
import './index.scss'

export interface AdditionCardProps {
  index: number
  pageContentRef: RefObject<HTMLIonContentElement>
  setAdditionIndex: Dispatch<SetStateAction<number | null>>
  control: Control<NewPurchase>
}

export const AdditionCard = ({ index, pageContentRef, setAdditionIndex, control }: AdditionCardProps): JSX.Element => {
  const theme = usePersistedStore.useTheme()
  const { members } = useStore.useSelectedGroup()
  const { errors } = useFormState({ control })
  const additionName = useWatch({ control, name: `additions.${index}.name` })
  const additionAmount = useWatch({ control, name: `additions.${index}.amount` })
  const [showCardContent, toggleShowCardContent] = useToggle(isEmpty(additionName))

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
          <IonLabel slot='end' color={clsx({ light: isDark(theme) })} style={{ marginInlineStart: 16 }}>
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
                label='Beteiligte'
                error={path(['additions', index, 'payerIds'], errors)}
                noMargin
              >
                <FormSelect name={`additions.${index}.payerIds`} selectOptions={members} control={control} multiple />
              </FormComponent>
            </IonCardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </IonCard>
  )
}
