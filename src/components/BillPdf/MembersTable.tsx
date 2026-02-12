import { Table, TH, TR } from '@ag-media/react-pdf-table'
import { StyleSheet, View } from '@react-pdf/renderer'
import { isEmpty, sort } from 'ramda'
import { ReactElement } from 'react'
import { MemberWithAmounts } from '../../App/types'
import { displayCurrencyValue, isLast } from '../../App/utils'
import { PDFCell } from './PDFComponents'
import { COLLATOR, getCurrentColor, ION_COLORS } from './utils'

type TableRowProps = {
  member: MemberWithAmounts
  isLastRow: boolean
}

const TableRow = ({ member, isLastRow }: TableRowProps) => {
  return (
    <TR style={[isLastRow ? { borderBottom: 'none' } : {}]}>
      <PDFCell variant='p2'>{member.name}</PDFCell>
      <PDFCell variant='p2' align='end'>
        {displayCurrencyValue(member.total)}
      </PDFCell>
      <PDFCell variant='p2' align='end' style={[styles.highlight, { color: getCurrentColor(member.current) }]}>
        {displayCurrencyValue(member.current)}
      </PDFCell>
    </TR>
  )
}

type MembersTableProps = {
  header: ReactElement
  membersWithAmounts: MemberWithAmounts[]
}

export const MembersTable = ({ header, membersWithAmounts }: MembersTableProps) => {
  const sortedMembers = sort((a, b) => COLLATOR.compare(a.name, b.name), membersWithAmounts)
  const [firstMember, ...restMembers] = sortedMembers

  return (
    <Table style={styles.table} trStyle={styles.tr}>
      <View wrap={false}>
        {header}
        <TH>
          <PDFCell variant='p3' style={styles.th}>
            NAME
          </PDFCell>
          <PDFCell variant='p3' align='end' style={styles.th}>
            AUSGABEN
          </PDFCell>
          <PDFCell variant='p3' align='end' style={styles.th}>
            SALDO
          </PDFCell>
        </TH>
        <TableRow member={firstMember} isLastRow={isEmpty(restMembers)} />
      </View>
      {restMembers.map((member, index) => (
        <TableRow key={member.id} member={member} isLastRow={isLast(index, restMembers)} />
      ))}
    </Table>
  )
}

const styles = StyleSheet.create({
  table: {
    border: 0,
  },
  tr: {
    padding: 4,
    borderBottom: `1px solid ${ION_COLORS.lightShade}`,
  },
  th: {
    fontWeight: 'normal',
  },
  highlight: {
    fontWeight: 'bold',
  },
})
