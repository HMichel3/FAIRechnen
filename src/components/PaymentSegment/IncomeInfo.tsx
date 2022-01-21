import { Income } from '../../App/types'
import { format } from 'date-fns'
import { displayCurrencyValue, findDifferentMembersInArrays } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useCallback } from 'react'
import { useStore } from '../../stores/useStore'
import { isEmpty, join, map, prop } from 'ramda'

export interface IncomeInfoProps {
  income: Income
}

export const IncomeInfo = ({ income }: IncomeInfoProps): JSX.Element => {
  const earner = usePersistedStore(useCallback(s => s.getMemberById(income.earnerId), [income]))
  const beneficiaries = usePersistedStore(useCallback(s => s.getMembersByIds(income.beneficiaryIds), [income]))
  const { groupMembers } = useStore.useSelectedGroup()

  const involvedMembers = income.isEarnerOnlyEarning ? beneficiaries : [earner, ...beneficiaries]
  const differentMembers = findDifferentMembersInArrays(involvedMembers, groupMembers)
  const involvedMemberNames = map(prop('name'), involvedMembers)
  const involvedMemberNamesSeparated = join(', ', involvedMemberNames)
  const memberNamesList = isEmpty(differentMembers) ? 'Alle' : involvedMemberNamesSeparated

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>{income.name}</div>
        <div>{displayCurrencyValue(income.amount)}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>Von {earner?.name}</div>
        <div>{format(income.timestamp, 'dd.MM.y, HH:mm')}</div>
      </div>
      <div className='small-label-component' style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: 16 }}>Für {memberNamesList}</div>
      </div>
    </>
  )
}
