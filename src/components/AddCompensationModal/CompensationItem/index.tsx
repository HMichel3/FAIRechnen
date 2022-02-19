import { IonItem, IonRadio, IonLabel } from '@ionic/react'
import clsx from 'clsx'
import { usePersistedStore } from '../../../stores/usePersistedStore'
import { CompensationInfo } from '../../PaymentSegment/CompensationInfo'
import { AlmostCompensation } from '../useAddCompensationModal'

interface CompensationItemProps {
  compensation: AlmostCompensation
}

export const CompensationItem = ({ compensation }: CompensationItemProps): JSX.Element => {
  const theme = usePersistedStore.useTheme()

  return (
    <IonItem className='item-border-color'>
      <IonRadio color={clsx({ light: theme === 'dark' })} slot='start' value={compensation.payerReceiverId} />
      <IonLabel>
        <CompensationInfo compensation={compensation} />
      </IonLabel>
    </IonItem>
  )
}
