import { IonButton, IonicSlides } from '@ionic/react'
import { informationCircleSharp, helpCircleSharp, bulbSharp } from 'ionicons/icons'
import { InfoSlideWithIcon } from './InfoSlideWithIcon'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import { Pagination } from 'swiper'
import img_group_overview from './images/Gruppenübersicht-bearbeitet.png'
import img_group_info from './images/Gruppenmitglieder-bearbeitet.png'
import { InfoSlideWithPicture } from './InfoSlideWithPicture'
import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'
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
        imgSrc={img_group_overview}
        imgAlt='Gruppenübersicht mit Bedienungshinweisen'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithPicture
        title='Gruppeninfo'
        imgSrc={img_group_info}
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
        secondParagraph='Durch das Wischen einzelner Listeneinträge nach rechts wird ein Knopf sichtbar, über welchem diese gelöscht werden können.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={helpCircleSharp}
        iconFontSize={216}
        title='Alles klar?'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='Über das Fragezeichen-Symbol in der Gruppenübersicht ist es möglich, diese Infos bei Bedarf erneut zu öffnen.'
      >
        <IonButton color='medium' onClick={onToggleShowInfoSlides}>
          Kann losgehen!
        </IonButton>
      </InfoSlideWithIcon>
    </SwiperSlide>
  </Swiper>
)
