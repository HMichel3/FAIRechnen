import { IonPage } from '@ionic/react'
import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export const PageLayout = ({ children }: PageLayoutProps): JSX.Element => <IonPage>{children}</IonPage>
