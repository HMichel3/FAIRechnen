import { useIonModal } from '@ionic/react'
import { useState } from 'react'
import { Income, Purchase } from '../../App/types'
import { IncomeModal } from '../IncomeModal'
import { PurchaseModal } from '../PurchaseModal'

export const usePaymentSegment = () => {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase>()
  const [selectedIncome, setSelectedIncome] = useState<Income>()
  const [showPurchaseModal, dismissPurchaseModal] = useIonModal(PurchaseModal, {
    onDismiss: () => dismissPurchaseModal(),
    selectedPurchase: selectedPurchase,
  })
  const [showIncomeModal, dismissIncomeModal] = useIonModal(IncomeModal, {
    onDismiss: () => dismissIncomeModal(),
    selectedIncome: selectedIncome,
  })

  const onSelectPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    showPurchaseModal()
  }

  const onSelectIncome = (income: Income) => {
    setSelectedIncome(income)
    showIncomeModal()
  }

  return { onSelectPurchase, onSelectIncome }
}
