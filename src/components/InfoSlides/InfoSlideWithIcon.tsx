import { IonIcon, IonButton } from '@ionic/react'
import { closeSharp } from 'ionicons/icons'
import { isNotNil } from 'ramda'
import { ReactNode } from 'react'
import { Show } from '../SolidComponents/Show'

interface InfoSlideWithIconProps {
  icon: string
  title: string
  firstParagraph: string
  onToggleShowInfoSlides: () => void
  secondParagraph?: string
  thirdParagraph?: string
  children?: ReactNode
}

export const InfoSlideWithIcon = ({
  icon,
  title,
  onToggleShowInfoSlides,
  firstParagraph,
  secondParagraph,
  thirdParagraph,
  children,
}: InfoSlideWithIconProps): JSX.Element => (
  <div className='h-full'>
    <div className='flex w-full flex-col items-center'>
      <IonButton color='danger' className='my-4 self-end' fill='clear' onClick={onToggleShowInfoSlides}>
        <IonIcon size='large' slot='icon-only' icon={closeSharp} />
      </IonButton>
      <IonIcon color='primary' className='text-[208px]' icon={icon} />
      <h1 className='my-4 text-3xl font-bold'>{title}</h1>
    </div>
    <div className='flex flex-col gap-4 px-8'>
      <p>{firstParagraph}</p>
      <Show when={isNotNil(secondParagraph)}>
        <p>{secondParagraph}</p>
      </Show>
      <Show when={isNotNil(thirdParagraph)}>
        <p>{thirdParagraph}</p>
      </Show>
      {children}
    </div>
  </div>
)
