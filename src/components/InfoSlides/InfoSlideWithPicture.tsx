import { IonButton, IonIcon, IonImg } from '@ionic/react'
import { closeSharp } from 'ionicons/icons'

interface InfoSlideWithPictureProps {
  title: string
  imgSrc: string
  imgAlt: string
  onToggleShowInfoSlides: () => void
}

export const InfoSlideWithPicture = ({ title, imgSrc, imgAlt, onToggleShowInfoSlides }: InfoSlideWithPictureProps) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <h1 className='ion-margin'>{title}</h1>
      <IonButton fill='clear' color='light' onClick={onToggleShowInfoSlides}>
        <IonIcon size='large' slot='icon-only' icon={closeSharp} />
      </IonButton>
    </div>
    <IonImg className='ion-margin picture-border' src={imgSrc} alt={imgAlt} />
  </>
)
