import { useState, useRef } from 'react'
import { AddCompensationModalProps } from '.'
import { Compensation } from '../../App/types'
import { findItemById } from '../../App/utils'
import { compensationDTO } from '../../dtos/compensationDTO'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { generatePossibleCompensations } from './utils'

export type AlmostCompensation = {
  payerReceiverId: string
  amount: number
  payerId: string
  receiverId: string
}

export type ManualCompensation = Omit<AlmostCompensation, 'payerReceiverId'>

export const useAddCompensationModal = (onDismiss: AddCompensationModalProps['onDismiss']) => {
  const theme = usePersistedStore.useTheme()
  const addCompensation = usePersistedStore.useAddCompensation()
  const { group, groupMembers } = useStore.useSelectedGroup()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const [manualCompensation, setManualCompensation] = useState<ManualCompensation | null>(null)
  const pageContentRef = useRef<HTMLIonContentElement>(null)
  const { current: possibleCompensations } = useRef(generatePossibleCompensations(groupMembers))
  const [checkedRadio, setCheckedRadio] = useState<string>(possibleCompensations[0].payerReceiverId)

  const onAddCompensation = () => {
    let newCompensation: Compensation
    if (checkedRadio === 'manual') {
      const { amount, payerId, receiverId } = manualCompensation!
      newCompensation = compensationDTO({ groupId: group.groupId, amount, payerId, receiverId })
    } else {
      const { amount, payerId, receiverId } = findItemById(checkedRadio, possibleCompensations, 'payerReceiverId')
      newCompensation = compensationDTO({ groupId: group.groupId, amount, payerId, receiverId })
    }
    addCompensation(newCompensation)
    showAnimationOnce()
    onDismiss()
  }

  const onCheckRadio = (value: string) => {
    setCheckedRadio(value)
    if (value === 'manual') {
      setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
    }
  }

  return {
    theme,
    pageContentRef,
    possibleCompensations,
    checkedRadio,
    manualCompensation,
    setManualCompensation,
    onAddCompensation,
    onCheckRadio,
  }
}
