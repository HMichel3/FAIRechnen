import { IonAlert, IonContent, IonLabel, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react'
import { Purchase } from '../../stores/types'
import { AdditionSegment } from './AdditionSegment'
import { PurchaseSegment } from './PurchaseSegment'
import { usePurchaseModal } from './usePurchaseModal'
import { useEffect, useRef, useState } from 'react'
import { ModalFooter } from '../modalComponents/ModalFooter'
import { AnimatePresence } from 'framer-motion'
import { displayCurrencyValue, getTotalAmountFromArray } from '../../App/utils'
import { ModalHeader } from '../modalComponents/ModalHeader'

export interface PurchaseModalProps {
  onDismiss: () => void
  selectedPurchase?: Purchase
}

export const PurchaseModal = ({ onDismiss, selectedPurchase }: PurchaseModalProps): JSX.Element => {
  const { showAdditionError, setShowAdditionError, onSubmit, watch, errors, control } = usePurchaseModal({
    onDismiss,
    selectedPurchase,
  })
  const [showSegment, setShowSegment] = useState('purchase')
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  useEffect(() => {
    if (errors.name || errors.amount || errors.beneficiaryIds) return setShowSegment('purchase')
    if (errors.additions) setShowSegment('additions')
  }, [errors])

  return (
    <form className='flex-column-full-height' onSubmit={onSubmit}>
      <ModalHeader title={selectedPurchase ? 'Einkauf bearbeiten' : 'Neuer Einkauf'} onDismiss={onDismiss}>
        <IonToolbar color='dark'>
          <IonSegment value={showSegment} onIonChange={({ detail }) => setShowSegment(detail.value!)}>
            <IonSegmentButton value='purchase'>
              <IonLabel>Einkauf ({displayCurrencyValue(watch('amount'))})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='additions'>
              <IonLabel>Zusätze ({displayCurrencyValue(getTotalAmountFromArray(watch('additions')))})</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </ModalHeader>
      <IonContent ref={pageContentRef}>
        <AnimatePresence exitBeforeEnter>
          {/* Key prop is needed for AnimatePresence to work correctly on 2 different Components */}
          {showSegment === 'purchase' && <PurchaseSegment key='purchase' control={control} />}
          {showSegment === 'additions' && (
            <AdditionSegment key='additions' pageContentRef={pageContentRef} control={control} />
          )}
        </AnimatePresence>
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
  )
}
