import { IonAlert } from '@ionic/react'
import { Purchase } from '../../App/types'
import { PageContent } from '../PageLayout/PageContent'
import { PageFooter } from '../PageLayout/PageFooter'
import { PageHeader } from '../PageLayout/PageHeader'
import { ButtonWithSaveIcon } from '../ButtonWithSaveIcon'
import { AdditionComponent } from './AdditionComponent'
import { PurchaseComponent } from './PurchaseComponent'
import { usePurchaseModal } from './usePurchaseModal'
import { FormProvider } from 'react-hook-form'
import { useRef } from 'react'

export interface PurchaseModalProps {
  onDismiss: () => void
  selectedPurchase?: Purchase
}

export const PurchaseModal = ({ onDismiss, selectedPurchase }: PurchaseModalProps): JSX.Element => {
  const { showAdditionError, setShowAdditionError, methods, onSubmit } = usePurchaseModal({
    onDismiss,
    selectedPurchase,
  })
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  return (
    <FormProvider {...methods}>
      <form className='flex-column-full-height' onSubmit={onSubmit}>
        <PageHeader title={selectedPurchase ? 'Einkauf bearbeiten' : 'Neuer Einkauf'} onCloseButton={onDismiss} />
        <PageContent ref={pageContentRef}>
          <PurchaseComponent />
          <AdditionComponent pageContentRef={pageContentRef} />
          <IonAlert
            isOpen={showAdditionError}
            onDidDismiss={() => setShowAdditionError(false)}
            header='Einkauf kann nicht gespeichert werden!'
            message='Der Gesamtbetrag aller Zusätze darf den Einkaufswert nicht überschreiten.'
            buttons={[{ role: 'cancel', text: 'Okay' }]}
          />
        </PageContent>
        <PageFooter>
          <ButtonWithSaveIcon type='submit'>Einkauf speichern</ButtonWithSaveIcon>
        </PageFooter>
      </form>
    </FormProvider>
  )
}
