import { Income } from '../../App/types'
import { format } from 'date-fns'
import { displayCurrencyValue, findItemById, findItemsByIds } from '../../App/utils'
import { useStore } from '../../stores/useStore'
import { displayBeneficiaryNames } from './utils'

export interface IncomeInfoProps {
  income: Income
}

export const IncomeInfo = ({ income }: IncomeInfoProps): JSX.Element => {
  const { groupMembers } = useStore.useSelectedGroup()
  const { name, amount, earnerId, beneficiaryIds, timestamp } = income
  const earner = findItemById(earnerId, groupMembers, 'memberId')
  const beneficiaries = findItemsByIds(beneficiaryIds, groupMembers, 'memberId')

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>{name}</div>
        <div>{displayCurrencyValue(amount)}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>Von {earner.name}</div>
        <div>{format(timestamp, 'dd.MM.y, HH:mm')}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>Für {displayBeneficiaryNames(beneficiaries, groupMembers)}</div>
      </div>
    </>
  )
}
