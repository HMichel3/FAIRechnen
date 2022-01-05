import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { GroupPage } from '../pages/GroupPage'
import { GroupInfoPage } from '../pages/GroupInfoPage'
import { useStore } from '../stores/useStore'
import { SuccessAnimation } from '../lotties/SuccessAnimation'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import '../theme/variables.css'

setupIonicReact()

// TODO Android-Folder aus dem Repo nehmen (Easy, da noch nicht gepusht)
// TODO Problem mit dem Laden der App fixen (soll nicht erst weiß sein und dann erst dunkel werden)
// TODO Neuerungen von Ionic 6 checken

export const App = (): JSX.Element => {
  const showAnimation = useStore.useShowAnimation()

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path='/groups' component={GroupPage} />
          <Route exact path='/groups/:id' component={GroupInfoPage} />
          <Redirect exact from='/' to='/groups' />
        </IonRouterOutlet>
        {showAnimation && <SuccessAnimation />}
      </IonReactRouter>
    </IonApp>
  )
}
