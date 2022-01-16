import { IonItem, IonLabel, IonRadio, IonRadioGroup } from '@ionic/react'
import { AnimatePresence } from 'framer-motion'
import { AddManualCompensation } from './AddManualCompensation'
import { PageContent } from '../PageLayout/PageContent'
import { PageFooter } from '../PageLayout/PageFooter'
import { PageHeader } from '../PageLayout/PageHeader'
import { CompensationItem } from './CompensationItem'
import { ButtonWithSaveIcon } from '../ButtonWithSaveIcon'
import clsx from 'clsx'
import { useAddCompensationModal } from './useAddCompensationModal'

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
    onSetCheckedRadio,
  } = useAddCompensationModal(onDismiss)

  return (
    <div className='flex-column-full-height'>
      <PageHeader title='Neue Zahlung' onCloseButton={onDismiss} />
      <PageContent ref={pageContentRef}>
        <IonRadioGroup value={checkedRadio} onIonChange={({ detail }) => onSetCheckedRadio(detail.value)}>
          {possibleCompensations.map(compensation => (
            <CompensationItem key={compensation.id} compensation={compensation} />
          ))}
          <IonItem lines='none'>
            <IonRadio color={clsx({ light: theme === 'dark' })} slot='start' value='manual' />
            <IonLabel>Manuelle Zahlung</IonLabel>
          </IonItem>
        </IonRadioGroup>
        <AnimatePresence exitBeforeEnter>
          {checkedRadio === 'manual' && <AddManualCompensation setManualCompensation={setManualCompensation} />}
        </AnimatePresence>
      </PageContent>
      <PageFooter>
        <ButtonWithSaveIcon disabled={checkedRadio === 'manual' && !manualCompensation} onClick={onAddCompensation}>
          Zahlung speichern
        </ButtonWithSaveIcon>
      </PageFooter>
    </div>
  )
}
