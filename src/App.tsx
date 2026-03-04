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
import { SideMenu } from './components/ui/SideMenu'
import { SuccessAnimation } from './lotties/SuccessAnimation'
import { AddCompensationPage } from './pages/AddCompensationPage'
import { AddContactPage } from './pages/AddContactPage'
import { AddGroupPage } from './pages/AddGroupPage'
import { ContactPage } from './pages/ContactPage'
import { GroupInfoPage } from './pages/GroupInfoPage'
import { GroupPage } from './pages/GroupPage'
import { IncomePage } from './pages/IncomePage'
import { MemberPage } from './pages/MemberPage'
import { PurchasePage } from './pages/PurchasePage'
import { usePersistedStore } from './stores/usePersistedStore'
import { determineEdgeToEdge } from './utils/common'

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
import './theme/variables.css'

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
  return (
    <>
      <SideMenu />
      <IonRouterOutlet id='main-content'>
        <Route path='/tabs' render={() => <TabsLayout />} />
        <Route exact path='/groups/:id' component={GroupInfoPage} />
        <Route exact path='/groups/:id/purchase/:purchaseId?' component={PurchasePage} />
        <Route exact path='/groups/:id/income/:incomeId?' component={IncomePage} />
        <Route exact path='/groups/:id/member/:memberId?' component={MemberPage} />
        <Route exact path='/groups/:id/compensation' component={AddCompensationPage} />
        <Route exact path='/groups/add' component={AddGroupPage} />
        <Route exact path='/contacts/add/:contactId?' component={AddContactPage} />
        <Redirect exact path='/' to='/tabs/groups' />
      </IonRouterOutlet>
      <SuccessAnimation />
    </>
  )
}

export const App = () => {
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
