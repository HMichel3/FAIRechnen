import { useIonModal } from '@ionic/react'
import { useState } from 'react'
import { Purchase } from '../../App/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { checkIfAllPurchaseInvolvedExist } from '../../stores/utils'
import { PurchaseModal } from '../PurchaseModal'

export const usePaymentSegment = () => {
  const deletePurchase = usePersistedStore.useDeletePurchase()
  const deleteCompensation = usePersistedStore.useDeleteCompensation()
  const { groupPayments, groupMembers } = useStore.useSelectedGroup()
  const [showCantEditPurchase, setShowCantEditPurchase] = useState(false)
  const [showCantEditCompensation, setShowCantEditCompensation] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | undefined>()
  const [showPurchaseModal, dismissPurchaseModal] = useIonModal(PurchaseModal, {
    onDismiss: () => dismissPurchaseModal(),
    selectedPurchase: selectedPurchase,
  })

  const onSelectPurchase = (purchase: Purchase) => {
    if (!checkIfAllPurchaseInvolvedExist(purchase.purchaserId, purchase.beneficiaryIds, groupMembers)) {
      setShowCantEditPurchase(true)
      return
    }
    setSelectedPurchase(purchase)
    showPurchaseModal()
  }

  return {
    groupPayments,
    showCantEditPurchase,
    setShowCantEditPurchase,
    showCantEditCompensation,
    setShowCantEditCompensation,
    deletePurchase,
    deleteCompensation,
    onSelectPurchase,
  }
}
