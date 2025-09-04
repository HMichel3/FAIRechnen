import { IonLabel, IonText } from '@ionic/react'
import { displayCurrencyValue, displayTimestamp, getIncomeInfo } from '../../App/utils'
import { Income } from '../../stores/types'
import { useStore } from '../../stores/useStore'
import { displayBeneficiaryNames } from './utils'

type IncomeInfoProps = {
  income: Income
}

export const IncomeInfo = ({ income }: IncomeInfoProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { earner, beneficiaries } = getIncomeInfo(income, members)

  return (
    <>
      <div className='mb-1 flex justify-between gap-4'>
        <IonLabel>{income.name}</IonLabel>
        <IonText>{displayCurrencyValue(income.amount)}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <IonLabel>Von {earner.name}</IonLabel>
        <IonText>{displayTimestamp(income.timestamp)}</IonText>
      </div>
      <div className='text-sm text-neutral-400'>
        <IonLabel>Für {displayBeneficiaryNames(beneficiaries, members)}</IonLabel>
      </div>
    </>
  )
}
