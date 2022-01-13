import { isEmpty } from 'ramda'
import { useFormState } from 'react-hook-form'
import { AdditionCardProps } from '.'
import { useToggle } from '../../../../hooks/useToggle'

export const useAdditionCard = ({
  control,
  addition,
  index,
  setDeleteAdditionIndex,
  setShowDeleteAdditionAlert,
  pageContentRef,
}: Omit<AdditionCardProps, 'groupMembers'>) => {
  const { errors } = useFormState({ control, name: 'additions' })
  const [showCardContent, toggleShowCardContent] = useToggle(isEmpty(addition.name))

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
    errors,
    onToggleShowCardContent,
    onDeleteAddition,
  }
}
