import { IonButton, IonCard, IonCardContent, IonCardTitle, IonIcon, IonItem, IonLabel } from '@ionic/react'
import { AnimatePresence, motion } from 'framer-motion'
import { chevronDownSharp, chevronUpSharp, trashBinSharp } from 'ionicons/icons'
import { isEmpty, isNil, path, trim } from 'ramda'
import { Dispatch, SetStateAction, useState } from 'react'
import { fadeInOutTopVariants, variantProps } from '../../../../App/animations'
import { displayCurrencyValue } from '../../../../App/utils'
import { FormInput } from '../../../formComponents/FormInput'
import { FormComponent } from '../../../formComponents/FormComponent'
import { FormCurrency } from '../../../formComponents/FormCurrency'
import { FormSelect } from '../../../formComponents/FormSelect'
import { Control, FieldError } from 'react-hook-form'
import { isDark } from '../../../../pages/GroupPage/utils'
import clsx from 'clsx'
import { NewAddition, NewPurchase } from '../../../../App/types'
import { SelectedGroup, Theme } from '../../../../stores/types'
import './index.scss'

interface AdditionCardProps {
  index: number
  setAdditionIndex: Dispatch<SetStateAction<number | null>>
  control: Control<NewPurchase>
  members: SelectedGroup['members']
  theme: Theme
  addition: NewAddition
  additionErrors:
    | {
        name?: FieldError | undefined
        amount?: FieldError | undefined
        payerIds?: FieldError[] | undefined
      }[]
    | undefined
}

export const AdditionCard = ({
  index,
  setAdditionIndex,
  addition,
  control,
  members,
  theme,
  additionErrors,
}: AdditionCardProps): JSX.Element => {
  const [showCardContent, setShowCardContent] = useState(
    isEmpty(addition.name) || !isNil(path([index], additionErrors))
  )

  const onToggleShowCardContent = () => {
    setShowCardContent(prevState => !prevState)
  }

  return (
    <IonCard className='default-margin'>
      <IonCardTitle>
        <IonItem lines='none'>
          <IonIcon
            slot='start'
            className='list-item-icon-color'
            icon={showCardContent ? chevronUpSharp : chevronDownSharp}
            style={{ marginInlineEnd: 12 }}
            onClick={onToggleShowCardContent}
          />
          <IonLabel onClick={onToggleShowCardContent}>
            {isEmpty(trim(addition.name)) ? 'Zusatz' : addition.name}
          </IonLabel>
          <IonLabel
            slot='end'
            color={clsx({ light: isDark(theme) })}
            style={{ marginInlineStart: 16 }}
            onClick={onToggleShowCardContent}
          >
            {displayCurrencyValue(addition.amount)}
          </IonLabel>
          <IonButton
            slot='end'
            fill='clear'
            onClick={() => setAdditionIndex(index)}
            style={{ marginInlineStart: 8, marginInlineEnd: -5 }}
          >
            <IonIcon color='danger' slot='icon-only' icon={trashBinSharp} />
          </IonButton>
        </IonItem>
      </IonCardTitle>
      <AnimatePresence mode='wait'>
        {showCardContent && (
          <motion.div variants={fadeInOutTopVariants} {...variantProps}>
            <IonCardContent style={{ paddingTop: 0 }}>
              <FormComponent
                className='addition-card-input form-input-no-margin'
                label='Zusatzname'
                error={path([index, 'name'], additionErrors)}
              >
                <FormInput name={`additions.${index}.name`} control={control} />
              </FormComponent>
              <FormComponent
                className='addition-card-input form-input-no-margin'
                label='Betrag'
                error={path([index, 'amount'], additionErrors)}
              >
                <FormCurrency name={`additions.${index}.amount`} control={control} />
              </FormComponent>
              <FormComponent
                className='addition-card-select form-input-no-margin'
                label='Beteiligte'
                error={path([index, 'payerIds'], additionErrors)}
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
