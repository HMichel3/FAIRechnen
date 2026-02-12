import { Link, StyleSheet, View } from '@react-pdf/renderer'
import { groupBy, prop, sort, toPairs } from 'ramda'
import { CompensationWithoutTimestamp } from '../../App/types'
import { displayCurrencyValue, findItem, getTotalAmountFromArray, isNotEmptyString } from '../../App/utils'
import { Member } from '../../stores/types'
import { PDFText } from './PDFComponents'
import { PDFIcons } from './PDFIcons'
import { COLLATOR, getPayPalUrl, ION_COLORS } from './utils'

type PayerCardProps = {
  name: string
  members: Member[]
  payerId: string
  payerCompensations?: CompensationWithoutTimestamp[]
}

const PayerCard = ({ name, payerId, members, payerCompensations = [] }: PayerCardProps) => {
  const payer = findItem(payerId, members)
  return (
    <View style={styles.card} wrap={false}>
      <View style={styles.header}>
        <PDFText variant='p2'>{payer?.name}</PDFText>
        <PDFText variant='p2'>{displayCurrencyValue(getTotalAmountFromArray(payerCompensations))}</PDFText>
      </View>
      <View style={styles.paymentWrapper}>
        {payerCompensations.map(({ id, amount, receiverId }) => {
          const receiver = findItem(receiverId, members)
          return (
            <View key={id} style={styles.payment}>
              <View style={styles.details}>
                <PDFText variant='p3' style={{ color: 'inherit' }}>
                  An {receiver?.name}
                </PDFText>
                <PDFText variant='p3' style={{ color: 'inherit', fontWeight: 'bold' }}>
                  {displayCurrencyValue(amount)}
                </PDFText>
              </View>
              {isNotEmptyString(receiver?.payPalMe) && (
                <Link src={getPayPalUrl(receiver.payPalMe, name, amount)} style={styles.payButton}>
                  <PDFIcons.PayPal size={15} />
                  <PDFText variant='p3' style={{ color: 'white' }}>
                    Bezahlen
                  </PDFText>
                </Link>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}

type PaymentSuggestionsProps = {
  name: string
  members: Member[]
  compensationChain: CompensationWithoutTimestamp[]
}

export const PaymentSuggestions = ({ name, members, compensationChain }: PaymentSuggestionsProps) => {
  const groupedByPayer = groupBy(prop('payerId'), compensationChain)
  const sortedPayers = sort((a, b) => {
    const nameA = findItem(a[0], members)?.name ?? ''
    const nameB = findItem(b[0], members)?.name ?? ''
    return COLLATOR.compare(nameA, nameB)
  }, toPairs(groupedByPayer))

  return (
    <View style={styles.wrapper}>
      {sortedPayers.map(([payerId, payerCompensations]) => (
        <PayerCard
          key={payerId}
          name={name}
          members={members}
          payerId={payerId}
          payerCompensations={payerCompensations}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  card: {
    width: '49.2%',
    borderRadius: 8,
    border: `1px solid ${ION_COLORS.lightShade}`,
    padding: 8,
  },
  header: {
    borderBottom: `1px solid ${ION_COLORS.lightShade}`,
    paddingBottom: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentWrapper: {
    gap: 4,
  },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
    backgroundColor: ION_COLORS.light,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  payButton: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: ION_COLORS.payPal,
    padding: 6,
    borderRadius: 6,
  },
})
