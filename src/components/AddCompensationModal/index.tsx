import { IonContent, IonFooter, IonItem, IonLabel, IonRadio, IonRadioGroup, IonToolbar } from '@ionic/react'
import { AnimatePresence } from 'framer-motion'
import { AddManualCompensation } from './AddManualCompensation'
import { CompensationItem } from './CompensationItem'
import { IconButton } from '../IconButton'
import clsx from 'clsx'
import { useAddCompensationModal } from './useAddCompensationModal'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { saveSharp } from 'ionicons/icons'

export interface AddCompensationModalProps {
  onDismiss: () => void
}

export const AddCompensationModal = ({ onDismiss }: AddCompensationModalProps): JSX.Element => {
  const {
    theme,
    pageContentRef,
    possibleCompensations,
    checkedRadio,
    manualCompensation,
    setManualCompensation,
    onAddCompensation,
    onCheckRadio,
  } = useAddCompensationModal(onDismiss)

  return (
    <div className='flex-column-full-height'>
      <ModalHeader onDismiss={onDismiss}>Neue Zahlung</ModalHeader>
      <IonContent ref={pageContentRef}>
        <IonRadioGroup value={checkedRadio} onIonChange={({ detail }) => onCheckRadio(detail.value)}>
          {possibleCompensations.map(compensation => (
            <CompensationItem key={compensation.payerReceiverId} compensation={compensation} />
          ))}
          <IonItem lines='none'>
            <IonRadio color={clsx({ light: theme === 'dark' })} slot='start' value='manual' />
            <IonLabel>Manuelle Zahlung</IonLabel>
          </IonItem>
        </IonRadioGroup>
        <AnimatePresence exitBeforeEnter>
          {checkedRadio === 'manual' && <AddManualCompensation setManualCompensation={setManualCompensation} />}
        </AnimatePresence>
      </IonContent>
      <IonFooter>
        <IonToolbar color='dark'>
          <IconButton
            icon={saveSharp}
            disabled={checkedRadio === 'manual' && !manualCompensation}
            onClick={onAddCompensation}
          >
            Zahlung speichern
          </IconButton>
        </IonToolbar>
      </IonFooter>
    </div>
  )
}
