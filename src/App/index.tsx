import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { SafeArea } from 'capacitor-plugin-safe-area'
import { Redirect, Route } from 'react-router-dom'
import { GroupInfoPage } from '../pages/GroupInfoPage'
import { GroupPage } from '../pages/GroupPage'
import { usePersistedStore } from '../stores/usePersistedStore'

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

/* Set safe area insets */
SafeArea.getSafeAreaInsets().then(data => {
  const { insets } = data
  document.body.style.setProperty('--ion-safe-area-top', `${insets.top}px`)
  document.body.style.setProperty('--ion-safe-area-right', `${insets.right}px`)
  document.body.style.setProperty('--ion-safe-area-bottom', `${insets.bottom}px`)
  document.body.style.setProperty('--ion-safe-area-left', `${insets.left}px`)
})

setupIonicReact()

export const App = (): JSX.Element | null => {
  const hasHydrated = usePersistedStore(s => s._hasHydrated)

  // Wait for zustand to be loaded with data from database
  if (!hasHydrated) return null

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path='/groups' component={GroupPage} />
          <Route exact path='/groups/:id' component={GroupInfoPage} />
          <Redirect exact from='/' to='/groups' />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}
