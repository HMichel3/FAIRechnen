import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon, IonToggle } from '@ionic/react'
import { moonSharp, sunnySharp } from 'ionicons/icons'
import { map } from 'ramda'
import { ReactNode } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'

interface PageHeaderProps {
  title: string
  backButton?: boolean
  onCloseButton?: () => void
  onToggleDarkMode?: () => void
  menuButtons?: { icon: string; onClick: () => void }[]
  children?: ReactNode
}

export const PageHeader = ({
  title,
  backButton,
  onCloseButton,
  onToggleDarkMode,
  menuButtons,
  children,
}: PageHeaderProps): JSX.Element => {
  const theme = usePersistedStore.useTheme()

  return (
    <IonHeader>
      <IonToolbar color='dark'>
        {backButton && (
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
        )}
        <IonTitle className='ion-padding-horizontal'>{title}</IonTitle>
        {onCloseButton ? (
          <IonButtons slot='end'>
            <IonButton color='danger' onClick={onCloseButton}>
              Abbrechen
            </IonButton>
          </IonButtons>
        ) : (
          (menuButtons || onToggleDarkMode) && (
            <IonButtons slot='end'>
              {onToggleDarkMode && (
                <>
                  <IonIcon icon={sunnySharp} />
                  <IonToggle checked={theme === 'dark'} color='medium' onIonChange={onToggleDarkMode} />
                  <IonIcon style={{ marginRight: 12 }} icon={moonSharp} />
                </>
              )}
              {menuButtons &&
                map(
                  ({ icon, onClick }) => (
                    <IonButton key={icon} onClick={onClick}>
                      <IonIcon slot='icon-only' icon={icon} />
                    </IonButton>
                  ),
                  menuButtons
                )}
            </IonButtons>
          )
        )}
      </IonToolbar>
      {children}
    </IonHeader>
  )
}
