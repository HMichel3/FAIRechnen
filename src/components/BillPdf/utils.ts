import { CSSProperties } from 'react'
import { getEuroValue, isNegative, isPositive } from '../../App/utils'

// see variables.css
export const ION_COLORS = {
  successShade: '#28ba62',
  danger: '#eb445a',
  mediumShade: '#808289',
  light: '#f4f5f8',
  lightShade: '#d7d8da',
  payPal: '#0038ba',
}

export const COLLATOR = new Intl.Collator('de', { sensitivity: 'accent' })

export const getCurrentColor = (current: number) => {
  let color: CSSProperties['color'] = 'inherit'
  if (isPositive(current)) {
    color = ION_COLORS.successShade
  } else if (isNegative(current)) {
    color = ION_COLORS.danger
  }
  return color
}

export const getPayPalUrl = (payPalMe: string, name: string, amount: number) => {
  const itemName = `FAIRechnen - ${name}`
  return `https://www.paypal.com/paypalme/${payPalMe}/${getEuroValue(amount)}EUR?item_name=${encodeURIComponent(itemName)}`
}
