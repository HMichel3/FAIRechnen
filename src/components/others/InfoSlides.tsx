import { IonButton, IonContent, IonIcon, IonicSlides, IonText } from '@ionic/react'
import '@ionic/react/css/ionic-swiper.css'
import { bulbSharp, closeSharp, helpCircleSharp, informationCircleSharp } from 'ionicons/icons'
import { PropsWithChildren } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { IconButton } from '../ui/IconButton'

type InfoSlideWithIconProps = PropsWithChildren<{
  icon: string
  title: string
  firstParagraph: string
  onDismiss: () => void
  secondParagraph?: string
  thirdParagraph?: string
}>

const InfoSlideWithIcon = ({
  icon,
  title,
  onDismiss,
  firstParagraph,
  secondParagraph,
  thirdParagraph,
  children,
}: InfoSlideWithIconProps) => (
  <div className='h-full'>
    <div className='flex w-full flex-col items-center'>
      <IconButton className='my-4 self-end' icon={closeSharp} color='dark' size='large' onClick={onDismiss} />
      <IonIcon color='primary' className='text-[208px]' icon={icon} />
      <h1 className='my-4 text-3xl font-bold'>{title}</h1>
    </div>
    <div className='flex flex-col gap-4 px-8'>
      <IonText>{firstParagraph}</IonText>
      {secondParagraph && <IonText>{secondParagraph}</IonText>}
      {thirdParagraph && <IonText>{thirdParagraph}</IonText>}
      {children}
    </div>
  </div>
)

type InfoSlidesProps = {
  onDismiss: () => void
}

export const InfoSlides = ({ onDismiss }: InfoSlidesProps) => (
  <IonContent color='light'>
    <Swiper className='h-full p-2' modules={[Pagination, IonicSlides]} pagination={{ type: 'progressbar' }}>
      <SwiperSlide className='h-full'>
        <InfoSlideWithIcon
          icon={informationCircleSharp}
          title='Willkommen'
          onDismiss={onDismiss}
          firstParagraph='FAIRechnen hilft Dir dabei, alle Einkäufe innerhalb einer Gruppe aufzulisten und den Überblick darüber zu behalten, welche Beträge am Ende noch gezahlt werden müssen.'
          secondParagraph='Zusätzlich werden Zahlungen vorgeschlagen, mit denen die Mitglieder bestmöglich ihre Schulden begleichen können.'
          thirdParagraph='Folgend sind einige Bedienungshinweise vorzufinden.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <InfoSlideWithIcon
          icon={bulbSharp}
          title='Listeneinträge'
          onDismiss={onDismiss}
          firstParagraph='Durch das Anklicken einzelner Listeneinträge können diese entweder geöffnet oder bearbeitet werden.'
          secondParagraph='Durch das Wischen einzelner Listeneinträge nach rechts wird ein Knopf sichtbar, über welchen diese gelöscht werden können.'
          thirdParagraph='Durch das Wischen einzelner Gruppen nach links wird ein Knopf sichtbar, über welchen diese archiviert oder wiederhergestellt werden können.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <InfoSlideWithIcon
          icon={helpCircleSharp}
          title='Alles klar?'
          onDismiss={onDismiss}
          firstParagraph='Über die Hilfe in den Optionen ist es möglich, diese Informationen bei Bedarf erneut zu öffnen.'
          secondParagraph='PS: Alle Daten werden ausschließlich auf Deinem Handy gespeichert!'
        >
          <IonButton onClick={onDismiss}>Kann losgehen!</IonButton>
        </InfoSlideWithIcon>
      </SwiperSlide>
    </Swiper>
  </IonContent>
)
