import { isNegative, isPositive } from '../../App/utils'

export const TW_BLUE_500 = '#2b7fff'
const TW_GREEN_200 = '#b9f8cf'
const TW_RED_200 = '#ffc9c9'

type RowStyle = {
  borderBottom?: number
  backgroundColor?: string
  color?: string
}

export const getRowStyle = (current: number) => {
  const style: RowStyle = {}
  if (isPositive(current)) {
    style.backgroundColor = TW_GREEN_200
  } else if (isNegative(current)) {
    style.backgroundColor = TW_RED_200
  }
  return { style }
}
