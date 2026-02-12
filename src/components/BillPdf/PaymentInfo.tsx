import { StyleSheet, View } from '@react-pdf/renderer'
import { isNotEmpty } from 'ramda'
import { ElementType } from 'react'
import { displayCurrencyValue, displayTimestamp, isNotEmptyString } from '../../App/utils'
import { Addition } from '../../stores/types'
import { displayAdditionQuantity } from '../PaymentSegment/utils'
import { PDFText } from './PDFComponents'
import { PDFIconProps } from './PDFIcons'
import { ION_COLORS } from './utils'

type PaymentInfoProps = {
  Icon: ElementType<PDFIconProps>
  name: string
  amount: number
  subtitle: string
  timestamp: number
  details?: string
  additions?: Addition[]
  description?: string
}

export const PaymentInfo = ({
  Icon,
  name,
  amount,
  subtitle,
  timestamp,
  details,
  additions,
  description,
}: PaymentInfoProps) => {
  const hasAdditions = additions && isNotEmpty(additions)
  const showDetailRow = details || hasAdditions

  return (
    <View style={styles.container} wrap={false}>
      <View style={styles.iconWrapper}>
        <Icon size={15} />
      </View>
      <View style={styles.contentWrapper}>
        <View style={[styles.row, { marginBottom: 4 }]}>
          <PDFText variant='p2' style={styles.flexText}>
            {name}
          </PDFText>
          <PDFText variant='p2' style={styles.noWrapText}>
            {displayCurrencyValue(amount)}
          </PDFText>
        </View>
        <View style={styles.row}>
          <PDFText variant='p3' style={styles.flexText}>
            {subtitle}
          </PDFText>
          <PDFText variant='p3' style={styles.noWrapText}>
            {displayTimestamp(timestamp)}
          </PDFText>
        </View>
        {showDetailRow && (
          <View style={styles.row}>
            <PDFText variant='p3' style={styles.flexText}>
              {details ?? ''}
            </PDFText>
            {hasAdditions && (
              <PDFText variant='p3' style={styles.noWrapText}>
                {displayAdditionQuantity(additions.length)}
              </PDFText>
            )}
          </View>
        )}
        {isNotEmptyString(description) && (
          <PDFText variant='p4' style={styles.description}>
            "{description}"
          </PDFText>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 12,
  },
  iconWrapper: {
    flexShrink: 0,
  },
  contentWrapper: {
    flex: 1,
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  flexText: {
    flex: 1,
    minWidth: 0,
  },
  noWrapText: {
    flexShrink: 0,
    textAlign: 'right',
  },
  description: {
    marginTop: 4,
    paddingLeft: 8,
    borderLeft: `2px solid ${ION_COLORS.lightShade}`,
  },
})
