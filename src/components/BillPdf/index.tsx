import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { map } from 'ramda'
import { MemberWithAmounts, Payment } from '../../App/types'
import { calculateGroupTotalAmount, displayCurrencyValue, displayTimestamp } from '../../App/utils'
import { displayHistoryQuantity, displayMemberQuantity } from '../../pages/GroupPage/utils'
import { Income, Purchase, SelectedGroup } from '../../stores/types'
import { isIncome, isPurchase } from '../PaymentSegment/utils'
import { CompensationInfo } from './CompensationInfo'
import { IncomeInfo } from './IncomeInfo'
import { PDFIcons } from './PDFIcons'
import { PurchaseInfo } from './PurchaseInfo'
import { getRowStyle, TW_BLUE_500 } from './utils'

type BillPdfProps = {
  name: SelectedGroup['name']
  purchases: Purchase[]
  incomes: Income[]
  membersWithAmounts: MemberWithAmounts[]
  sortedPayments: Payment[]
}

export const BillPdf = ({
  name,
  purchases,
  incomes,
  membersWithAmounts,
  sortedPayments,
}: BillPdfProps): JSX.Element => {
  const groupTotalAmount = calculateGroupTotalAmount(purchases, incomes)

  return (
    <Document>
      <Page size='A4' style={{ padding: 16, gap: 16 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 16,
            fontWeight: 'bold',
            color: TW_BLUE_500,
            fontSize: 20,
          }}
        >
          <Text>FAIRechnen</Text>
          <Text>{displayTimestamp(Date.now())}</Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: 'bold', color: TW_BLUE_500 }}>{name}</Text>
          <View style={{ fontSize: 16, gap: 4, paddingHorizontal: 4 }}>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <PDFIcons.PersonSharp size={18} />
              <Text>{displayMemberQuantity(membersWithAmounts.length)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <PDFIcons.DocumentTextSharp size={18} />
              <Text>{displayHistoryQuantity(sortedPayments.length)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <PDFIcons.DiamondSharp size={18} />
              <Text>{displayCurrencyValue(groupTotalAmount)}</Text>
            </View>
          </View>
        </View>
        <View style={{ gap: 2 }}>
          <Text style={{ fontWeight: 'bold', color: TW_BLUE_500 }}>Mitglieder</Text>
          <Table
            style={{ fontSize: 16, border: 0 }}
            trStyle={{ borderBottom: '1px solid #92949c', paddingVertical: 4, paddingHorizontal: 4 }}
          >
            <TH>
              <TD>Name</TD>
              <TD style={{ justifyContent: 'flex-end' }}>Ausgaben</TD>
              <TD style={{ justifyContent: 'flex-end' }}>Saldo</TD>
            </TH>
            {membersWithAmounts.map(({ id, name, current, total }) => (
              <TR key={id} {...getRowStyle(current)}>
                <TD>{name}</TD>
                <TD style={{ justifyContent: 'flex-end' }}>{displayCurrencyValue(total)}</TD>
                <TD style={{ justifyContent: 'flex-end' }}>{displayCurrencyValue(current)}</TD>
              </TR>
            ))}
          </Table>
        </View>
        <View style={{ gap: 6.5 }}>
          <Text style={{ fontWeight: 'bold', color: TW_BLUE_500 }}>Historie</Text>
          <View style={{ gap: 8, paddingHorizontal: 4 }}>
            {map(payment => {
              if (isPurchase(payment)) {
                return <PurchaseInfo key={payment.id} purchase={payment} members={membersWithAmounts} />
              }
              if (isIncome(payment)) {
                return <IncomeInfo key={payment.id} income={payment} members={membersWithAmounts} />
              }
              return <CompensationInfo key={payment.id} compensation={payment} members={membersWithAmounts} />
            }, sortedPayments)}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// can be used to render the PDF in the DOM for making easy adjustments
// export function renderPDF(props: BillPdfProps) {
//   return createPortal(
//     <PDFViewer className='absolute inset-0 h-dvh w-dvw'>
//       <BillPdf {...props} />
//     </PDFViewer>,
//     document.body
//   )
// }
