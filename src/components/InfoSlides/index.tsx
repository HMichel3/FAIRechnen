import { IonButton, IonicSlides } from '@ionic/react'
import {
  informationCircleSharp,
  addCircleSharp,
  logoEuro,
  helpCircleSharp,
  closeCircleSharp,
  createSharp,
  bulbSharp,
} from 'ionicons/icons'
import { InfoSlideWithIcon } from './InfoSlideWithIcon'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import { Pagination } from 'swiper'
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
        firstParagraph='Die split it App hilft Dir dabei, alle Einkäufe innerhalb einer Gruppe aufzulisten, um einen Überblick darüber zu bekommen, wer am Ende welchen Betrag bekommt/bezahlen muss.'
        secondParagraph='Zusätzlich werden Zahlungen zwischen den Mitgliedern vorgeschlagen, mit denen bestmöglich alle Schulden beglichen werden können.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={addCircleSharp}
        title='Hinzufügen'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='Es lassen sich Gruppen erstellen, in welchen Mitglieder, Einkäufe und Zahlungen hinzugefügt werden können.'
        secondParagraph='Innerhalb einzelner Einkäufe besteht die Möglichkeit Zusätze hinzuzufügen. Diese sind immer dann sinnvoll, wenn ein Teil des Einkaufs nur für einzelne Mitglieder gekauft wird.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={logoEuro}
        title='Beträge'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='In der App tauchen die verschiedensten Beträge auf:'
        secondParagraph='In der Gruppenübersicht stellen die Beträge die Summe aller Einkäufe der entsprechenden Gruppe dar.'
        thirdParagraph='In der Gruppeninfo stellen die Beträge unter den Mitgliedern den Betrag dar, den das einzelne Mitglied bislang ausgegeben hat, während die Beträge am Ende der Zeile anzeigen, wie viel dieses noch bekommt/bezahlen muss.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={createSharp}
        title='Bearbeiten'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='Über das Stift-Symbol oben rechts in der Gruppeninfo kann der Gruppenname geändert werden.'
        secondParagraph='Das Bearbeiten von Mitgliedern und Einkäufen ist ebenfalls möglich, indem einfach die entsprechenden Listeneinträge ausgewählt werden.'
        thirdParagraph='Das Bearbeiten von Zahlungen ist nicht möglich.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={closeCircleSharp}
        title='Löschen'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='Durch das Wischen einzelner Listeneinträge nach rechts wird ein Knopf sichtbar, mit welchem sich die einzelnen Einträge löschen lassen.'
        secondParagraph='Das Löschen von Mitgliedern mit einem Restbetrag ungleich 0,00€ ist nicht möglich.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={bulbSharp}
        title='Sonstiges'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='Über das Pfeil-Symbol oben rechts in der Gruppenübersicht kann die Reihenfolge der Gruppen angepasst werden.'
        secondParagraph='Über das Exportieren-Symbol oben rechts in der Gruppeninfo können Ausgabenübersicht und Zahlungsvorschläge der Gruppe geteilt werden.'
      />
    </SwiperSlide>
    <SwiperSlide style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <InfoSlideWithIcon
        icon={helpCircleSharp}
        iconFontSize={216}
        title='Alles klar?'
        onToggleShowInfoSlides={onToggleShowInfoSlides}
        firstParagraph='Über das Fragezeichen-Symbol oben rechts in der Gruppenübersicht ist es möglich, diese Infos bei Bedarf erneut zu öffnen.'
      >
        <IonButton color='medium' onClick={onToggleShowInfoSlides}>
          Kann losgehen!
        </IonButton>
      </InfoSlideWithIcon>
    </SwiperSlide>
  </Swiper>
)
