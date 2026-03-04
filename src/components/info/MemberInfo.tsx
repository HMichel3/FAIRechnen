import { IonText } from '@ionic/react'
import { MemberWithAmounts } from '../../types/common'
import { cn, displayCurrencyValue, isNegative, isNotEmptyString, isPositive } from '../../utils/common'

type MemberInfoProps = {
  member: MemberWithAmounts
}

export const MemberInfo = ({ member }: MemberInfoProps) => {
  return (
    <div className='flex items-center gap-4'>
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <IonText className='truncate'>{member.name}</IonText>
        <div className='flex w-full items-center gap-2'>
          <IonText className='shrink-0 text-sm text-neutral-400'>{displayCurrencyValue(member.total)}</IonText>
          {isNotEmptyString(member.payPalMe) && (
            <>
              <IonText className='shrink-0 text-sm text-neutral-400'>•</IonText>
              <IonText className='min-w-0 truncate text-sm text-neutral-400'>@{member.payPalMe}</IonText>
            </>
          )}
        </div>
      </div>
      <IonText
        className='shrink-0 whitespace-nowrap'
        color={cn({ success: isPositive(member.current), danger: isNegative(member.current) })}
      >
        {displayCurrencyValue(member.current)}
      </IonText>
    </div>
  )
}
