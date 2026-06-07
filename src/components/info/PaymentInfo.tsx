import { IonIcon, IonText } from '@ionic/react'
import { cubeSharp, documentTextSharp } from 'ionicons/icons'
import { hasAtLeast } from 'remeda'
import { Addition } from '../../types/store'
import { displayCurrencyValue, displayTimestamp } from '../../utils/display'
import { isNotEmptyString } from '../../utils/guard'

type DetailsRowProps = Pick<PaymentInfoProps, 'details' | 'additions' | 'description'>

const DetailsRow = ({ details, additions, description }: DetailsRowProps) => {
  const hasDescription = isNotEmptyString(description)
  const hasAdditions = additions && hasAtLeast(additions, 1)
  const showDetailRow = details || hasDescription || hasAdditions

  if (!showDetailRow) {
    return null
  }

  return (
    <div className='flex items-center justify-between gap-4 text-sm text-neutral-400'>
      <IonText className='truncate'>{details ?? ''}</IonText>
      {(hasDescription || hasAdditions) && (
        <div className='flex gap-1'>
          {hasDescription && <IonIcon className='text-base' icon={documentTextSharp} />}
          {hasAdditions && <IonIcon className='text-base' icon={cubeSharp} />}
        </div>
      )}
    </div>
  )
}

type PaymentInfoProps = {
  name: string
  amount: number
  subtitle: string
  timestamp?: number
  details?: string
  additions?: Addition[]
  description?: string
}

export const PaymentInfo = ({
  name,
  amount,
  subtitle,
  timestamp,
  details,
  additions,
  description,
}: PaymentInfoProps) => {
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
      <DetailsRow details={details} additions={additions} description={description} />
    </>
  )
}
