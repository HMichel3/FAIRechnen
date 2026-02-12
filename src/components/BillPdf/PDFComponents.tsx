import { TD } from '@ag-media/react-pdf-table'
import { TableCellProps } from '@ag-media/react-pdf-table/lib/TableCell'
import { Styles, StyleSheet, Text, TextProps } from '@react-pdf/renderer'
import { PropsWithChildren } from 'react'
import { ION_COLORS } from './utils'

const styles = StyleSheet.create({
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  p1: {
    fontSize: 16,
  },
  p2: {
    fontSize: 14,
  },
  p3: {
    fontSize: 12,
    color: ION_COLORS.mediumShade,
  },
  p4: {
    fontSize: 10,
    color: ION_COLORS.mediumShade,
    fontStyle: 'italic',
  },
})

type PDFTextProps = TextProps &
  PropsWithChildren<{
    variant: keyof typeof styles
  }>

export const PDFText = ({ variant, style, children, ...props }: PDFTextProps) => {
  const combinedStyles = [styles[variant], style].flat().filter(Boolean) as Styles[]

  return (
    <Text style={combinedStyles} {...props}>
      {children}
    </Text>
  )
}

type PDFCellProps = TableCellProps & PropsWithChildren<{ variant: keyof typeof styles; align?: 'start' | 'end' }>

export const PDFCell = ({ variant, align = 'start', style, children, ...props }: PDFCellProps) => {
  const combinedStyles = [styles[variant], align === 'end' && { justifyContent: 'flex-end' }, style]
    .flat()
    .filter(Boolean) as Styles[]

  return (
    <TD style={combinedStyles} {...props}>
      {children}
    </TD>
  )
}
