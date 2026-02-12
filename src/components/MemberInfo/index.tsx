import { IonText } from '@ionic/react'
import { MemberWithAmounts } from '../../App/types'
import { displayCurrencyValue, isNotEmptyString } from '../../App/utils'
import { Show } from '../SolidComponents/Show'

type MemberInfoProps = {
  member: MemberWithAmounts
}

export const MemberInfo = ({ member }: MemberInfoProps): JSX.Element => {
  return (
    <div className='flex gap-2'>
      <IonText className='text-sm text-neutral-400'>{displayCurrencyValue(member.total)}</IonText>
      <Show when={isNotEmptyString(member.payPalMe)}>
        <>
          <IonText className='text-sm text-neutral-400'>•</IonText>
          <IonText className='truncate text-sm text-neutral-400'>@{member.payPalMe}</IonText>
        </>
      </Show>
    </div>
  )
}
