import { IonContent } from '@ionic/react'
import { forwardRef, ReactNode } from 'react'

interface PageContentProps {
  children: ReactNode
}

export const PageContent = forwardRef<HTMLIonContentElement, PageContentProps>(
  ({ children }, ref): JSX.Element => <IonContent ref={ref}>{children}</IonContent>
)
