import clsx from 'clsx'

interface InfoSlideParagraphProps {
  text: string
  isFirst?: boolean
}

export const InfoSlideParagraph = ({ text, isFirst }: InfoSlideParagraphProps): JSX.Element => (
  <p className={clsx('info-slide-paragraph', { 'ion-margin-top': isFirst })}>{text}</p>
)
