import { IonFooter, IonToolbar } from '@ionic/react'
import { ReactNode } from 'react'

interface PageFooterProps {
  children: ReactNode
}

export const PageFooter = ({ children }: PageFooterProps): JSX.Element => (
  <IonFooter>
    <IonToolbar color='dark'>{children}</IonToolbar>
  </IonFooter>
)
