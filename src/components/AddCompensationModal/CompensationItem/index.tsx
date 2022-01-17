import { IonItem, IonRadio, IonLabel } from '@ionic/react'
import clsx from 'clsx'
import { Compensation } from '../../../App/types'
import { usePersistedStore } from '../../../stores/usePersistedStore'
import { CompensationInfo } from '../../PaymentSegment/CompensationInfo'

interface CompensationItemProps {
  compensation: Compensation
}

export const CompensationItem = ({ compensation }: CompensationItemProps): JSX.Element => {
  const theme = usePersistedStore.useTheme()

  return (
    <IonItem className='item-border-color'>
      <IonRadio color={clsx({ light: theme === 'dark' })} slot='start' value={compensation.id} />
      <IonLabel>
        <CompensationInfo compensation={compensation} />
      </IonLabel>
    </IonItem>
  )
}
