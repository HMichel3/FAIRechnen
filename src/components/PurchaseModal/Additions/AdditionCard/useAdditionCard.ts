import { gt, isEmpty } from 'ramda'
import { useRef } from 'react'
import { useFormState } from 'react-hook-form'
import { AdditionCardProps } from '.'
import { useDebounce } from '../../../../hooks/useDebounce'
import { useToggle } from '../../../../hooks/useToggle'

export const useAdditionCard = ({
  control,
  addition,
  register,
  index,
  setDeleteAdditionIndex,
  setShowDeleteAdditionAlert,
  pageContentRef,
}: Omit<AdditionCardProps, 'groupMembers'>) => {
  const { errors } = useFormState({ control, name: 'additions' })
  const additionRef = useRef(addition)
  const additionNameRef = useRef<HTMLIonInputElement | null>(null)
  const { ref: firstInputRef, ...firstInputRest } = register(`additions.${index}.name`)
  const [showCardContent, toggleShowCardContent] = useToggle(isEmpty(additionRef.current.name))
  const isNoInputDefault = gt(addition.amount, 0) && !isEmpty(addition.name) && !isEmpty(addition.beneficiaryIds)

  useDebounce(
    () => {
      if (isEmpty(additionRef.current.name) && isNoInputDefault) {
        additionRef.current = addition
        toggleShowCardContent(false)
      }
    },
    1000,
    [addition, toggleShowCardContent]
  )

  const onDeleteAddition = () => {
    // undo setShowCardContent from the onClick on IonCardTitle
    toggleShowCardContent()
    setDeleteAdditionIndex(index)
    setShowDeleteAdditionAlert(true)
  }

  const onToggleShowCardContent = () => {
    toggleShowCardContent()
    setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
  }

  return {
    showCardContent,
    firstInputRef,
    firstInputRest,
    additionNameRef,
    errors,
    onToggleShowCardContent,
    onDeleteAddition,
  }
}
