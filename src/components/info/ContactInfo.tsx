import { IonText } from '@ionic/react'
import { Member } from '../../types/store'
import { isNotEmptyString } from '../../utils/guard'

type ContactInfoProps = {
  contact: Member
}

export const ContactInfo = ({ contact }: ContactInfoProps) => {
  return (
    <div className='flex flex-col justify-center gap-1'>
      <IonText className='truncate'>{contact.name}</IonText>
      {isNotEmptyString(contact.payPalMe) && (
        <IonText className='truncate text-sm text-neutral-400'>@{contact.payPalMe}</IonText>
      )}
    </div>
  )
}
