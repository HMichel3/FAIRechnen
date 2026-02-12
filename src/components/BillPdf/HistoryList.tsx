import { StyleSheet, View } from '@react-pdf/renderer'
import { ReactElement } from 'react'
import { MemberWithAmounts, Payment } from '../../App/types'
import { getCompensationInfo, getIncomeInfo, getPurchaseInfo, isFirst, isLast } from '../../App/utils'
import { displayBeneficiaryNames, isCompensation, isIncome, isPurchase } from '../PaymentSegment/utils'
import { PaymentInfo } from './PaymentInfo'
import { PDFIcons } from './PDFIcons'
import { ION_COLORS } from './utils'

type HistoryListProps = {
  header: ReactElement
  sortedPayments: Payment[]
  membersWithAmounts: MemberWithAmounts[]
}

export const HistoryList = ({ header, sortedPayments, membersWithAmounts }: HistoryListProps) => {
  return (
    <View>
      {sortedPayments.map((payment, index) => {
        let Component = null
        if (isPurchase(payment)) {
          const { purchaser, beneficiaries, additionPayers } = getPurchaseInfo(payment, membersWithAmounts)
          Component = (
            <PaymentInfo
              {...payment}
              Icon={PDFIcons.CartSharp}
              subtitle={`Von ${purchaser?.name}`}
              details={`Für ${displayBeneficiaryNames(beneficiaries, membersWithAmounts, additionPayers)}`}
            />
          )
        }
        if (isIncome(payment)) {
          const { earner, beneficiaries } = getIncomeInfo(payment, membersWithAmounts)
          Component = (
            <PaymentInfo
              {...payment}
              Icon={PDFIcons.ServerSharp}
              subtitle={`Von ${earner?.name}`}
              details={`Für ${displayBeneficiaryNames(beneficiaries, membersWithAmounts)}`}
            />
          )
        }
        if (isCompensation(payment)) {
          const { payer, receiver } = getCompensationInfo(payment, membersWithAmounts)
          Component = (
            <PaymentInfo
              {...payment}
              Icon={PDFIcons.WalletSharp}
              name={payer!.name}
              subtitle={`An ${receiver?.name}`}
            />
          )
        }
        return (
          <View key={payment.id} wrap={false}>
            {isFirst(index) && header}
            {Component}
            {!isLast(index, sortedPayments) && <View style={styles.divider} />}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  divider: {
    paddingVertical: 8,
    borderBottom: `1px solid ${ION_COLORS.lightShade}`,
    marginTop: -16,
  },
})
