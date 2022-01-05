import { isEmpty } from 'ramda'
import { Purchase } from '../../App/types'
import { displayCurrencyValue } from '../../App/utils'

interface AmountAdditionInfoProps {
  payment: Purchase
}

export const AmountAdditionInfo = ({ payment }: AmountAdditionInfoProps): JSX.Element => {
  if (isEmpty(payment.additions)) {
    return <div style={{ marginBottom: 55 }}>{displayCurrencyValue(payment.amount)}</div>
  }

  return (
    <>
      <div style={{ marginBottom: 39 }}>{displayCurrencyValue(payment.amount)}</div>
      <div className='small-label-component'>
        {payment.additions.length === 1 ? '1 Zusatz' : `${payment.additions.length} Zusätze`}
      </div>
    </>
  )
}
