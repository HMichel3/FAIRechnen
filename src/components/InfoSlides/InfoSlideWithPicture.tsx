import { IonButton, IonIcon, IonImg } from '@ionic/react'
import { closeSharp } from 'ionicons/icons'

interface InfoSlideWithPictureProps {
  title: string
  imgSrc: string
  imgAlt: string
  onHideShowInfoSlides: () => void
}

export const InfoSlideWithPicture = ({ title, imgSrc, imgAlt, onHideShowInfoSlides }: InfoSlideWithPictureProps) => (
  <div className='h-full'>
    <div className='flex w-full justify-between'>
      <h1 className='m-4 text-3xl font-bold'>{title}</h1>
      <IonButton color='danger' className='my-4' fill='clear' onClick={onHideShowInfoSlides}>
        <IonIcon size='large' slot='icon-only' icon={closeSharp} />
      </IonButton>
    </div>
    <IonImg className='m-4 border border-[#3880ff]' src={imgSrc} alt={imgAlt} />
  </div>
)
