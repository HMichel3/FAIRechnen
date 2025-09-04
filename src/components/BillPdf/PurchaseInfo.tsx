import { Text, View } from '@react-pdf/renderer'
import { displayCurrencyValue, displayTimestamp, getPurchaseInfo } from '../../App/utils'
import { Member, Purchase } from '../../stores/types'
import { displayAdditionQuantity, displayBeneficiaryNames } from '../PaymentSegment/utils'
import { PDFIcons } from './PDFIcons'

type PurchaseInfoProps = {
  purchase: Purchase
  members: Member[]
}

export const PurchaseInfo = ({ purchase, members }: PurchaseInfoProps) => {
  const { purchaser, beneficiaries, additionPayers } = getPurchaseInfo(purchase, members)

  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, fontSize: 16 }} wrap={false}>
      <PDFIcons.CartSharp size={18} />
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
          <Text>{purchase.name}</Text>
          <Text>{displayCurrencyValue(purchase.amount)}</Text>
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
          <Text>Von {purchaser.name}</Text>
          <Text>{displayTimestamp(purchase.timestamp)}</Text>
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
          <Text style={{ flex: 1, minWidth: 0 }}>
            Für {displayBeneficiaryNames(beneficiaries, members, additionPayers)}
          </Text>
          <Text style={{ flexShrink: 0 }}>{displayAdditionQuantity(purchase.additions.length)}</Text>
        </View>
      </View>
    </View>
  )
}
