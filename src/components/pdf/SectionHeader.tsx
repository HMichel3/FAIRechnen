import { StyleSheet, View } from '@react-pdf/renderer'
import { PropsWithChildren } from 'react'
import { ION_COLORS } from '../../utils/pdf'
import { PDFText } from './PDFComponents'

export const SectionHeader = ({ children }: PropsWithChildren) => {
  return (
    <View style={styles.sectionHeader} wrap={false}>
      <View style={styles.sectionAccent} />
      <PDFText variant='h2' style={{ lineHeight: 1 }}>
        {children}
      </PDFText>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    backgroundColor: ION_COLORS.payPal,
    borderRadius: 2,
  },
})
