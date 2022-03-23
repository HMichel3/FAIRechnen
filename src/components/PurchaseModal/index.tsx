import { IonAlert, IonContent } from '@ionic/react'
import { Purchase } from '../../stores/types'
import { AdditionComponent } from './AdditionComponent'
import { PurchaseComponent } from './PurchaseComponent'
import { usePurchaseModal } from './usePurchaseModal'
import { FormProvider } from 'react-hook-form'
import { useRef } from 'react'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { ModalFooter } from '../modalComponents/ModalFooter'

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
        <ModalHeader onDismiss={onDismiss}>{selectedPurchase ? 'Einkauf bearbeiten' : 'Neuer Einkauf'}</ModalHeader>
        <IonContent ref={pageContentRef}>
          <PurchaseComponent />
          <AdditionComponent pageContentRef={pageContentRef} />
          <IonAlert
            isOpen={showAdditionError}
            onDidDismiss={() => setShowAdditionError(false)}
            header='Einkauf kann nicht gespeichert werden!'
            message='Der Gesamtbetrag aller Zusätze darf den Einkaufswert nicht überschreiten.'
            buttons={[{ role: 'cancel', text: 'Okay' }]}
          />
        </IonContent>
        <ModalFooter>Einkauf speichern</ModalFooter>
      </form>
    </FormProvider>
  )
}
