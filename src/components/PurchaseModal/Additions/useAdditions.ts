import { useState } from 'react'
import { useFieldArray, useWatch } from 'react-hook-form'
import { AdditionsProps } from '.'
import { getTotalAmountFromArray } from '../../../App/utils'

export const useAdditions = ({ control, pageContentRef }: Omit<AdditionsProps, 'register' | 'groupMembers'>) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'additions' })
  const additions = useWatch({ control, name: 'additions' })
  const [showDeleteAdditionAlert, setShowDeleteAdditionAlert] = useState(false)
  const [deleteAdditionIndex, setDeleteAdditionIndex] = useState<number | null>(null)
  const additionsTotalAmount = getTotalAmountFromArray(additions)

  const onAddAddition = () => {
    append({ name: '', amount: 0, beneficiaryIds: [] })
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  const onDeleteAddition = () => {
    remove(deleteAdditionIndex!)
    setDeleteAdditionIndex(null)
  }

  return {
    fields,
    remove,
    additions,
    additionsTotalAmount,
    showDeleteAdditionAlert,
    setShowDeleteAdditionAlert,
    setDeleteAdditionIndex,
    onAddAddition,
    onDeleteAddition,
  }
}
