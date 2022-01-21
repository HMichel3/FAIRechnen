import { useIonModal } from '@ionic/react'
import { isEmpty } from 'ramda'
import { useState } from 'react'
import { Income, Member, Purchase } from '../../App/types'
import { findDifferentMembersInArrays } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { getAllBeneficiaryIdsFromPurchase } from '../../stores/utils'
import { IncomeModal } from '../IncomeModal'
import { PurchaseModal } from '../PurchaseModal'

export const usePaymentSegment = () => {
  const getMembersByIds = usePersistedStore.useGetMembersByIds()
  const { groupPayments, groupMembers } = useStore.useSelectedGroup()
  const [purchaseMembersNotExisting, setPurchaseMembersNotExisting] = useState<Member[]>([])
  const [incomeMembersNotExisting, setIncomeMembersNotExisting] = useState<Member[]>([])
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
    const allBeneficiaryIdsFromPurchase = getAllBeneficiaryIdsFromPurchase(purchase.beneficiaryIds, purchase.additions)
    const allPurchaseMembers = getMembersByIds([purchase.purchaserId, ...allBeneficiaryIdsFromPurchase])
    const purchaseMembersNotExisting = findDifferentMembersInArrays(allPurchaseMembers, groupMembers, false)
    if (!isEmpty(purchaseMembersNotExisting)) {
      setPurchaseMembersNotExisting(purchaseMembersNotExisting)
      return
    }
    setSelectedPurchase(purchase)
    showPurchaseModal()
  }

  const onSelectIncome = (income: Income) => {
    const allIncomeMembers = getMembersByIds([income.earnerId, ...income.beneficiaryIds])
    const incomeMembersNotExisting = findDifferentMembersInArrays(allIncomeMembers, groupMembers, false)
    if (!isEmpty(incomeMembersNotExisting)) {
      setIncomeMembersNotExisting(incomeMembersNotExisting)
      return
    }
    setSelectedIncome(income)
    showIncomeModal()
  }

  return {
    groupPayments,
    purchaseMembersNotExisting,
    setPurchaseMembersNotExisting,
    incomeMembersNotExisting,
    setIncomeMembersNotExisting,
    onSelectPurchase,
    onSelectIncome,
  }
}
