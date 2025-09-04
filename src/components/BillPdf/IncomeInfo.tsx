import { Text, View } from '@react-pdf/renderer'
import { displayCurrencyValue, displayTimestamp, getIncomeInfo } from '../../App/utils'
import { Income, Member } from '../../stores/types'
import { displayBeneficiaryNames } from '../PaymentSegment/utils'
import { PDFIcons } from './PDFIcons'

type IncomeInfoProps = {
  income: Income
  members: Member[]
}

export const IncomeInfo = ({ income, members }: IncomeInfoProps) => {
  const { earner, beneficiaries } = getIncomeInfo(income, members)

  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, fontSize: 16 }} wrap={false}>
      <PDFIcons.ServerSharp size={18} />
      <View style={{ width: '100%' }}>
        <View
          style={{
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <Text>{income.name}</Text>
          <Text>{displayCurrencyValue(income.amount)}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 16,
            fontSize: 14,
            lineHeight: 1.25,
          }}
        >
          <Text>Von {earner.name}</Text>
          <Text>{displayTimestamp(income.timestamp)}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 16,
            fontSize: 14,
            lineHeight: 1.25,
            flexWrap: 'wrap',
          }}
        >
          <Text style={{ flex: 1, minWidth: 0 }}>Für {displayBeneficiaryNames(beneficiaries, members)}</Text>
        </View>
      </View>
    </View>
  )
}
