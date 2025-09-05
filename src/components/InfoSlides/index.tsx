import { IonButton, IonContent, IonicSlides } from '@ionic/react'
import '@ionic/react/css/ionic-swiper.css'
import { bulbSharp, helpCircleSharp, informationCircleSharp } from 'ionicons/icons'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { InfoSlideWithIcon } from './InfoSlideWithIcon'

type InfoSlidesProps = {
  insets: { top: number; right: number; bottom: number; left: number }
  onHideShowInfoSlides: () => void
}

export const InfoSlides = ({ insets, onHideShowInfoSlides }: InfoSlidesProps): JSX.Element => (
  <IonContent
    color='light'
    className='z-[1001]'
    style={{
      '--padding-top': `${insets.top}px`,
      '--padding-right': `${insets.right}px`,
      '--padding-bottom': `${insets.bottom}px`,
      '--padding-left': `${insets.left}px`,
    }}
  >
    <Swiper className='h-full p-2' modules={[Pagination, IonicSlides]} pagination={{ type: 'progressbar' }}>
      <SwiperSlide className='h-full'>
        <InfoSlideWithIcon
          icon={informationCircleSharp}
          title='Willkommen'
          onHideShowInfoSlides={onHideShowInfoSlides}
          firstParagraph='FAIRechnen hilft Dir dabei, alle Einkäufe innerhalb einer Gruppe aufzulisten und den Überblick darüber zu behalten, welche Beträge am Ende noch gezahlt werden müssen.'
          secondParagraph='Zusätzlich werden Zahlungen vorgeschlagen, mit denen die Mitglieder bestmöglich ihre Schulden begleichen können.'
          thirdParagraph='Folgend sind einige Bedienungshinweise vorzufinden.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <InfoSlideWithIcon
          icon={bulbSharp}
          title='Listeneinträge'
          onHideShowInfoSlides={onHideShowInfoSlides}
          firstParagraph='Durch das Anklicken einzelner Listeneinträge können diese entweder geöffnet oder bearbeitet werden.'
          secondParagraph='Durch das Wischen einzelner Listeneinträge nach rechts wird ein Knopf sichtbar, über welchen diese gelöscht werden können.'
          thirdParagraph='Durch das Wischen einzelner Gruppen nach links wird ein Knopf sichtbar, über welchen diese archiviert oder wiederhergestellt werden können.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <InfoSlideWithIcon
          icon={helpCircleSharp}
          title='Alles klar?'
          onHideShowInfoSlides={onHideShowInfoSlides}
          firstParagraph='Über die Hilfe in den Optionen ist es möglich, diese Informationen bei Bedarf erneut zu öffnen.'
          secondParagraph='PS: Alle Daten werden ausschließlich auf Deinem Handy gespeichert!'
        >
          <IonButton onClick={onHideShowInfoSlides}>Kann losgehen!</IonButton>
        </InfoSlideWithIcon>
      </SwiperSlide>
    </Swiper>
  </IonContent>
)
