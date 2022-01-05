import { useState, useRef, useMemo } from 'react'
import { AddCompensationModalProps } from '.'
import { Compensation } from '../../App/types'
import { generatePossibleCompensations, getArrayItemById } from '../../App/utils'
import { compensationDTO, CompensationWithoutIdsAndTimeStamp } from '../../dtos/compensationDTO'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

export const useAddCompensationModal = (onDismiss: AddCompensationModalProps['onDismiss']) => {
  const theme = usePersistedStore.useTheme()
  const addCompensation = usePersistedStore.useAddCompensation()
  const { group, groupMembers } = useStore.useSelectedGroup()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const [manualCompensation, setManualCompensation] = useState<CompensationWithoutIdsAndTimeStamp | null>(null)
  const pageContentRef = useRef<HTMLIonContentElement>(null)
  const possibleCompensations = useMemo(
    () => generatePossibleCompensations(group.id, groupMembers),
    [group.id, groupMembers]
  )
  const [checkedRadio, setCheckedRadio] = useState<string>(possibleCompensations[0]?.id)

  const onAddCompensation = () => {
    let compensation: Compensation
    if (checkedRadio === 'manual') {
      compensation = compensationDTO(
        group.id,
        manualCompensation!.amount,
        manualCompensation!.payerId,
        manualCompensation!.receiverId
      )
    } else {
      compensation = getArrayItemById(checkedRadio, possibleCompensations)
    }
    addCompensation(compensation)
    showAnimationOnce()
    onDismiss()
  }

  const onSetCheckedRadio = (value: any) => {
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
    onSetCheckedRadio,
  }
}
