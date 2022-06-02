import { IonButton, IonicSlides } from '@ionic/react'
import { informationCircleSharp, helpCircleSharp, bulbSharp } from 'ionicons/icons'
import { InfoSlideWithIcon } from './InfoSlideWithIcon'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import GroupOverviewImage from './images/Gruppenübersicht-bearbeitet.png'
import GroupInfoImage from './images/Gruppeninfo-bearbeitet.png'
import { InfoSlideWithPicture } from './InfoSlideWithPicture'
import 'swiper/css'
import 'swiper/css/pagination'
import '@ionic/react/css/ionic-swiper.css'
import './index.scss'

interface InfoSlidesProps {
  onToggleShowInfoSlides: () => void
}

export const InfoSlides = ({ onToggleShowInfoSlides }: InfoSlidesProps): JSX.Element => (
  <Swiper className='slides-bullet-active' modules={[Pagination, IonicSlides]} pagination={true} loop={true}>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={informationCircleSharp}
        iconFontSize={208}
        title='Willkommen'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='FAIRechnen hilft Dir dabei, alle Einkäufe innerhalb einer Gruppe aufzulisten und den Überblick darüber zu behalten, welche Beträge am Ende noch gezahlt werden müssen.'
        secondParagraph='Zusätzlich werden Zahlungen vorgeschlagen, mit denen die Mitglieder bestmöglich ihre Schulden begleichen können.'
        thirdParagraph='Folgend sind einige Bedienungshinweise vorzufinden.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithPicture
        title='Gruppenübersicht'
        imgSrc={GroupOverviewImage}
        imgAlt='Gruppenübersicht mit Bedienungshinweisen'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithPicture
        title='Gruppeninfo'
        imgSrc={GroupInfoImage}
        imgAlt='Gruppeninfo mit Bedienungshinweisen'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={bulbSharp}
        iconFontSize={208}
        title='Listeneinträge'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='Durch das Anklicken einzelner Listeneinträge können diese entweder geöffnet oder bearbeitet werden.'
        secondParagraph='Durch das Wischen einzelner Listeneinträge nach rechts wird ein Knopf sichtbar, über welchen diese gelöscht werden können.'
        thirdParagraph='Durch das Wischen einzelner Gruppen nach links wird ein Knopf sichtbar, über welchen diese archiviert oder wiederhergestellt werden können.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={helpCircleSharp}
        iconFontSize={216}
        title='Alles klar?'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='Über die Hilfe in den Optionen ist es möglich, diese Informationen bei Bedarf erneut zu öffnen.'
        secondParagraph='PS: Alle Daten werden ausschließlich auf Deinem Handy gespeichert!'
      >
        <IonButton color='medium' onClick={onToggleShowInfoSlides}>
          Kann losgehen!
        </IonButton>
      </InfoSlideWithIcon>
    </SwiperSlide>
  </Swiper>
)
