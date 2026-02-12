import { IonText } from '@ionic/react'
import { displayCurrencyValue, displayTimestamp } from '../../App/utils'

type PaymentInfoProps = {
  name: string
  amount: number
  subtitle: string
  timestamp?: number
}

export const PaymentInfo = ({ name, amount, subtitle, timestamp }: PaymentInfoProps) => {
  return (
    <>
      <div className='mb-1 flex justify-between gap-4'>
        <IonText className='truncate'>{name}</IonText>
        <IonText className='whitespace-nowrap'>{displayCurrencyValue(amount)}</IonText>
      </div>
      <div className='flex justify-between gap-4 text-sm text-neutral-400'>
        <IonText className='truncate'>{subtitle}</IonText>
        {timestamp && <IonText className='whitespace-nowrap'>{displayTimestamp(timestamp, { noYear: true })}</IonText>}
      </div>
    </>
  )
}
