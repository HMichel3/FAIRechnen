import { Text, View } from '@react-pdf/renderer'
import { CompensationsWithoutTimestamp } from '../../App/types'
import { displayCurrencyValue, getCompensationInfo } from '../../App/utils'
import { Member } from '../../stores/types'
import { PDFIcons } from './PDFIcons'

type CompensationInfoProps = {
  compensation: CompensationsWithoutTimestamp
  members: Member[]
}

export const CompensationInfo = ({ compensation, members }: CompensationInfoProps) => {
  const { payer, receiver } = getCompensationInfo(compensation, members)

  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, fontSize: 16 }} wrap={false}>
      <PDFIcons.WalletSharp size={18} />
      <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 4.5 }}>
          <Text>{payer.name}</Text>
        </View>
        <View style={{ flex: 3, alignItems: 'center', fontSize: 14, lineHeight: 1.25 }}>
          <Text>{displayCurrencyValue(compensation.amount)}</Text>
          <PDFIcons.ArrowForwardSharp size={18} />
        </View>
        <View style={{ flex: 4.5, textAlign: 'right' }}>
          <Text>{receiver.name}</Text>
        </View>
      </View>
    </View>
  )
}
