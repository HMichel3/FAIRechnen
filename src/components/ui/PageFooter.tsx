import { IonFooter, IonToolbar } from '@ionic/react'
import { saveSharp } from 'ionicons/icons'
import { ComponentProps } from 'react'
import { IconButton } from './IconButton'

type PageFooterProps = Omit<ComponentProps<typeof IconButton>, 'icon'>

export const PageFooter = ({ children, ...props }: PageFooterProps) => (
  <IonFooter>
    <IonToolbar>
      <IconButton icon={saveSharp} {...props}>
        {children}
      </IconButton>
    </IonToolbar>
  </IonFooter>
)
