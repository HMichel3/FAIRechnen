import { IonIcon, IonButton } from '@ionic/react'
import { closeSharp } from 'ionicons/icons'
import { isNil } from 'ramda'
import { ReactNode } from 'react'
import { Show } from '../SolidComponents/Show'
import { InfoSlideParagraph } from './InfoSlideParagraph'

interface InfoSlideWithIconProps {
  icon: string
  title: string
  firstParagraph: string
  onToggleShowInfoSlides: () => void
  secondParagraph?: string
  thirdParagraph?: string
  iconFontSize?: number
  children?: ReactNode
}

export const InfoSlideWithIcon = ({
  icon,
  title,
  onToggleShowInfoSlides,
  firstParagraph,
  secondParagraph,
  thirdParagraph,
  iconFontSize = 200,
  children,
}: InfoSlideWithIconProps): JSX.Element => {
  // need this stuff to manually adjust the icons, because the got a different amount of free space around them
  const leftIconFontSize = iconFontSize - 200
  const iconMarginTop = -leftIconFontSize / 2
  const titleMarginTop = 20 - leftIconFontSize / 2

  return (
    <>
      <IonButton
        className='ion-align-self-end default-margin-top'
        fill='clear'
        color='light'
        onClick={onToggleShowInfoSlides}
      >
        <IonIcon size='large' slot='icon-only' icon={closeSharp} />
      </IonButton>
      <IonIcon color='medium' style={{ fontSize: iconFontSize, marginTop: iconMarginTop }} icon={icon} />
      <h1 style={{ marginTop: titleMarginTop }}>{title}</h1>
      <InfoSlideParagraph isFirst text={firstParagraph} />
      <Show when={!isNil(secondParagraph)}>
        <InfoSlideParagraph text={secondParagraph!} />
      </Show>
      <Show when={!isNil(thirdParagraph)}>
        <InfoSlideParagraph text={thirdParagraph!} />
      </Show>
      {children}
    </>
  )
}
