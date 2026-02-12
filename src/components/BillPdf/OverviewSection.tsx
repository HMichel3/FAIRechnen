import { StyleSheet, View } from '@react-pdf/renderer'
import { displayCurrencyValue } from '../../App/utils'
import { PDFText } from './PDFComponents'
import { ION_COLORS } from './utils'

type OverviewSectionProps = {
  memberQuantity: number
  historyQuantity: number
  totalAmount: number
}

export const OverviewSection = ({ memberQuantity, historyQuantity, totalAmount }: OverviewSectionProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.item}>
        <PDFText variant='p3'>MITGLIEDER</PDFText>
        <PDFText variant='p1' style={styles.value}>
          {memberQuantity}
        </PDFText>
      </View>
      <View style={styles.separator} />
      <View style={styles.item}>
        <PDFText variant='p3'>EINTRÄGE</PDFText>
        <PDFText variant='p1' style={styles.value}>
          {historyQuantity}
        </PDFText>
      </View>
      <View style={styles.separator} />
      <View style={styles.item}>
        <PDFText variant='p3'>GESAMT</PDFText>
        <PDFText variant='p1' style={styles.value}>
          {displayCurrencyValue(totalAmount)}
        </PDFText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    border: `1px solid ${ION_COLORS.lightShade}`,
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: ION_COLORS.lightShade,
  },
  value: {
    fontWeight: 'bold',
  },
})
