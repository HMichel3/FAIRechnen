import { format } from 'date-fns'
import { displayCurrencyValue, findItem, findItems } from '../../App/utils'
import { displayBeneficiaryNames } from './utils'
import { IonLabel } from '@ionic/react'
import { Income } from '../../stores/types'
import { useStore } from '../../stores/useStore'

interface IncomeInfoProps {
  income: Income
}

export const IncomeInfo = ({ income }: IncomeInfoProps): JSX.Element => {
  const { members } = useStore(s => s.selectedGroup)
  const { name, amount, earnerId, beneficiaryIds, timestamp } = income
  const earner = findItem(earnerId, members)
  const beneficiaries = findItems(beneficiaryIds, members)

  return (
    <>
      <div style={{ display: 'flex' }}>
        <IonLabel style={{ flex: 1, paddingRight: 16 }}>{name}</IonLabel>
        <div>{displayCurrencyValue(amount)}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <IonLabel style={{ flex: 1, paddingRight: 16 }}>Von {earner.name}</IonLabel>
        <div>{format(timestamp, 'dd.MM.y, HH:mm')}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <IonLabel style={{ flex: 1 }}>Für {displayBeneficiaryNames(beneficiaries, members)}</IonLabel>
      </div>
    </>
  )
}
