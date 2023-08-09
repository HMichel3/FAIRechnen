import { IonButton, IonContent, IonicSlides } from '@ionic/react'
import { informationCircleSharp, helpCircleSharp, bulbSharp } from 'ionicons/icons'
import { InfoSlideWithIcon } from './InfoSlideWithIcon'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { InfoSlideWithPicture } from './InfoSlideWithPicture'
import 'swiper/css'
import 'swiper/css/pagination'
import '@ionic/react/css/ionic-swiper.css'

interface InfoSlidesProps {
  onToggleShowInfoSlides: () => void
}

export const InfoSlides = ({ onToggleShowInfoSlides }: InfoSlidesProps): JSX.Element => (
  <IonContent color='light' className='z-[1001]'>
    <Swiper className='h-full' modules={[Pagination, IonicSlides]} pagination={true} loop={true}>
      <SwiperSlide className='h-full'>
        <InfoSlideWithIcon
          icon={informationCircleSharp}
          title='Willkommen'
          onToggleShowInfoSlides={onToggleShowInfoSlides}
          firstParagraph='FAIRechnen hilft Dir dabei, alle Einkäufe innerhalb einer Gruppe aufzulisten und den Überblick darüber zu behalten, welche Beträge am Ende noch gezahlt werden müssen.'
          secondParagraph='Zusätzlich werden Zahlungen vorgeschlagen, mit denen die Mitglieder bestmöglich ihre Schulden begleichen können.'
          thirdParagraph='Folgend sind einige Bedienungshinweise vorzufinden.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <InfoSlideWithPicture
          title='Gruppenübersicht'
          imgSrc={new URL('./images/Gruppenübersicht-bearbeitet.png', import.meta.url).href}
          imgAlt='Gruppenübersicht mit Bedienungshinweisen'
          onToggleShowInfoSlides={onToggleShowInfoSlides}
        />
      </SwiperSlide>
      <SwiperSlide>
        <InfoSlideWithPicture
          title='Gruppeninfo'
          imgSrc={new URL('./images/Gruppeninfo-bearbeitet.png', import.meta.url).href}
          imgAlt='Gruppeninfo mit Bedienungshinweisen'
          onToggleShowInfoSlides={onToggleShowInfoSlides}
        />
      </SwiperSlide>
      <SwiperSlide>
        <InfoSlideWithIcon
          icon={bulbSharp}
          title='Listeneinträge'
          onToggleShowInfoSlides={onToggleShowInfoSlides}
          firstParagraph='Durch das Anklicken einzelner Listeneinträge können diese entweder geöffnet oder bearbeitet werden.'
          secondParagraph='Durch das Wischen einzelner Listeneinträge nach rechts wird ein Knopf sichtbar, über welchen diese gelöscht werden können.'
          thirdParagraph='Durch das Wischen einzelner Gruppen nach links wird ein Knopf sichtbar, über welchen diese archiviert oder wiederhergestellt werden können.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <InfoSlideWithIcon
          icon={helpCircleSharp}
          title='Alles klar?'
          onToggleShowInfoSlides={onToggleShowInfoSlides}
          firstParagraph='Über die Hilfe in den Optionen ist es möglich, diese Informationen bei Bedarf erneut zu öffnen.'
          secondParagraph='PS: Alle Daten werden ausschließlich auf Deinem Handy gespeichert!'
        >
          <IonButton onClick={onToggleShowInfoSlides}>Kann losgehen!</IonButton>
        </InfoSlideWithIcon>
      </SwiperSlide>
    </Swiper>
  </IonContent>
)
