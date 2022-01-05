import { IonAlert } from '@ionic/react'
import { Purchase } from '../../App/types'
import { PageContent } from '../PageLayout/PageContent'
import { PageFooter } from '../PageLayout/PageFooter'
import { PageHeader } from '../PageLayout/PageHeader'
import { ButtonWithSaveIcon } from '../ButtonWithSaveIcon'
import { Additions } from './Additions'
import { PurchaseComponent } from './PurchaseComponent'
import { isNotNil } from 'ramda-adjunct'
import { usePurchaseModal } from './usePurchaseModal'

export interface PurchaseModalProps {
  onDismiss: () => void
  selectedPurchase?: Purchase
}

export const PurchaseModal = ({ onDismiss, selectedPurchase }: PurchaseModalProps): JSX.Element => {
  const {
    pageContentRef,
    groupMembers,
    membersWithoutPurchaser,
    showAdditionError,
    setShowAdditionError,
    register,
    control,
    onSubmit,
  } = usePurchaseModal({ onDismiss, selectedPurchase })

  return (
    <form className='flex-column-full-height' onSubmit={onSubmit}>
      <PageHeader title={selectedPurchase ? 'Einkauf bearbeiten' : 'Neuer Einkauf'} onCloseButton={onDismiss} />
      <PageContent ref={pageContentRef}>
        <PurchaseComponent
          isPurchaseSelected={isNotNil(selectedPurchase)}
          {...{ register, control, groupMembers, membersWithoutPurchaser }}
        />
        <Additions {...{ register, control, pageContentRef, groupMembers }} />
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
  )
}
