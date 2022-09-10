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
import { useStore } from '../../../../stores/useStore'
import { Control, useFormState, useWatch } from 'react-hook-form'
import { usePersistedStore } from '../../../../stores/usePersistedStore'
import { isDark } from '../../../../pages/GroupPage/utils'
import clsx from 'clsx'
import { NewPurchase } from '../../../../App/types'
import './index.scss'

interface AdditionCardProps {
  index: number
  setAdditionIndex: Dispatch<SetStateAction<number | null>>
  control: Control<NewPurchase>
}

export const AdditionCard = ({ index, setAdditionIndex, control }: AdditionCardProps): JSX.Element => {
  const theme = usePersistedStore(s => s.theme)
  const { members } = useStore(s => s.selectedGroup)
  const { errors } = useFormState({ control })
  const additionName = useWatch({ control, name: `additions.${index}.name` })
  const additionAmount = useWatch({ control, name: `additions.${index}.amount` })
  const [showCardContent, setShowCardContent] = useState(
    isEmpty(additionName) || !isNil(path(['additions', index], errors))
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
          <IonLabel onClick={onToggleShowCardContent}>{isEmpty(trim(additionName)) ? 'Zusatz' : additionName}</IonLabel>
          <IonLabel
            slot='end'
            color={clsx({ light: isDark(theme) })}
            style={{ marginInlineStart: 16 }}
            onClick={onToggleShowCardContent}
          >
            {displayCurrencyValue(additionAmount)}
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
      <AnimatePresence exitBeforeEnter>
        {showCardContent && (
          <motion.div variants={fadeInOutTopVariants} {...variantProps}>
            <IonCardContent style={{ paddingTop: 0 }}>
              <FormComponent
                className='addition-card-input form-input-no-margin'
                label='Zusatzname'
                error={path(['additions', index, 'name'], errors)}
              >
                <FormInput name={`additions.${index}.name`} control={control} />
              </FormComponent>
              <FormComponent
                className='addition-card-input form-input-no-margin'
                label='Betrag'
                error={path(['additions', index, 'amount'], errors)}
              >
                <FormCurrency name={`additions.${index}.amount`} control={control} />
              </FormComponent>
              <FormComponent
                className='addition-card-select form-input-no-margin'
                label='Beteiligte'
                error={path(['additions', index, 'payerIds'], errors)}
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
