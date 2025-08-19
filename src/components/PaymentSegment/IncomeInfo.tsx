import { IonLabel, IonText } from '@ionic/react'
import { format } from 'date-fns'
import { displayCurrencyValue, findItem, findItems } from '../../App/utils'
import { Income } from '../../stores/types'
import { useStore } from '../../stores/useStore'
import { displayBeneficiaryNames } from './utils'

type IncomeInfoProps = {
  income: Income
}

export const IncomeInfo = ({ income }: IncomeInfoProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { name, amount, earnerId, beneficiaryIds, timestamp } = income
  const earner = findItem(earnerId, members)
  const beneficiaries = findItems(beneficiaryIds, members)

  return (
    <>
      <div className='mb-1 flex justify-between gap-4'>
        <IonLabel>{name}</IonLabel>
        <IonText>{displayCurrencyValue(amount)}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <IonLabel>Von {earner.name}</IonLabel>
        <IonText>{format(timestamp, 'dd.MM.y, HH:mm')}</IonText>
      </div>
      <div className='text-sm text-neutral-400'>
        <IonLabel>Für {displayBeneficiaryNames(beneficiaries, members)}</IonLabel>
      </div>
    </>
  )
}
