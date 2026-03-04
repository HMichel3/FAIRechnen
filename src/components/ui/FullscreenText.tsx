import { IonText } from '@ionic/react'
import { ComponentProps } from 'react'

export const FullscreenText = ({ children, ...props }: ComponentProps<typeof IonText>) => {
  return (
    <IonText className='grid h-full place-items-center pb-20 text-center text-lg text-neutral-400' {...props}>
      {children}
    </IonText>
  )
}
