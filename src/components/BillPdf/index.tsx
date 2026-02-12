import { Document, Image, Page, StyleSheet, View } from '@react-pdf/renderer'
import { isNotEmpty } from 'ramda'
import pdfLogo from '../../../resources/icon-pdf.png'
import { CompensationWithoutTimestamp, MemberWithAmounts, Payment } from '../../App/types'
import { calculateGroupTotalAmount, displayTimestamp } from '../../App/utils'
import { Income, Purchase, SelectedGroup } from '../../stores/types'
import { HistoryList } from './HistoryList'
import { MembersTable } from './MembersTable'
import { OverviewSection } from './OverviewSection'
import { PDFText } from './PDFComponents'
import { PaymentSuggestions } from './PaymentSuggestions'
import { SectionHeader } from './SectionHeader'

type BillPdfProps = {
  name: SelectedGroup['name']
  purchases: Purchase[]
  incomes: Income[]
  membersWithAmounts: MemberWithAmounts[]
  sortedPayments: Payment[]
  compensationChain: CompensationWithoutTimestamp[]
}

export const BillPdf = ({
  name,
  purchases,
  incomes,
  membersWithAmounts,
  sortedPayments,
  compensationChain,
}: BillPdfProps) => {
  const groupTotalAmount = calculateGroupTotalAmount({ purchases, incomes })

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.title}>
          <PDFText variant='h1'>{name}</PDFText>
          <Image src={pdfLogo} style={styles.logo} />
        </View>
        <View>
          <SectionHeader>Übersicht</SectionHeader>
          <OverviewSection
            memberQuantity={membersWithAmounts.length}
            historyQuantity={sortedPayments.length}
            totalAmount={groupTotalAmount}
          />
        </View>
        {isNotEmpty(compensationChain) && (
          <View>
            <SectionHeader>Zahlungsvorschläge</SectionHeader>
            <PaymentSuggestions name={name} members={membersWithAmounts} compensationChain={compensationChain} />
          </View>
        )}
        {isNotEmpty(membersWithAmounts) && (
          <MembersTable header={<SectionHeader>Mitglieder</SectionHeader>} membersWithAmounts={membersWithAmounts} />
        )}
        {isNotEmpty(sortedPayments) && (
          <HistoryList
            header={<SectionHeader>Historie</SectionHeader>}
            sortedPayments={sortedPayments}
            membersWithAmounts={membersWithAmounts}
          />
        )}
        <View style={styles.footer} fixed>
          <PDFText variant='p4'>
            © {new Date().getFullYear()} FAIRechnen • {displayTimestamp(Date.now())}
          </PDFText>
          <PDFText variant='p4' render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    gap: 32,
    paddingBottom: 66,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 32,
    marginBottom: -18, // needed to remove the extra gap to the overview because of the icon
  },
  logo: {
    width: 40,
    height: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
