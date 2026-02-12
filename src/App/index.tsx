import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { peopleCircleSharp, peopleSharp } from 'ionicons/icons'
import { useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { SideMenu } from '../components/SideMenu'
import { Show } from '../components/SolidComponents/Show'
import { SuccessAnimation } from '../lotties/SuccessAnimation'
import { ContactPage } from '../pages/ContactPage'
import { GroupInfoPage } from '../pages/GroupInfoPage'
import { GroupPage } from '../pages/GroupPage'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { determineEdgeToEdge } from './utils'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'

/* Theme variables */
import '../theme/variables.css'

setupIonicReact()

const TabsLayout = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path='/tabs/groups' render={() => <GroupPage />} />
        <Route exact path='/tabs/contacts' render={() => <ContactPage />} />
      </IonRouterOutlet>
      <IonTabBar slot='bottom'>
        <IonTabButton tab='groups' href='/tabs/groups'>
          <IonIcon icon={peopleSharp} />
          <IonLabel>Gruppen</IonLabel>
        </IonTabButton>
        <IonTabButton tab='contacts' href='/tabs/contacts'>
          <IonIcon icon={peopleCircleSharp} />
          <IonLabel>Kontakte</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}

const AppContent = () => {
  const showAnimation = useStore(s => s.showAnimation)

  return (
    <>
      <SideMenu />
      <IonRouterOutlet id='main-content'>
        <Route path='/tabs' render={() => <TabsLayout />} />
        <Route exact path='/groups/:id' component={GroupInfoPage} />
        <Redirect exact path='/' to='/tabs/groups' />
      </IonRouterOutlet>
      <Show when={showAnimation}>
        <SuccessAnimation />
      </Show>
    </>
  )
}

export const App = (): JSX.Element | null => {
  const hasHydrated = usePersistedStore(s => s._hasHydrated)

  useEffect(() => {
    determineEdgeToEdge()
  }, [])

  // Wait for zustand to be loaded with data from database
  if (!hasHydrated) return null

  return (
    <IonApp>
      <IonReactRouter>
        <AppContent />
      </IonReactRouter>
    </IonApp>
  )
}
