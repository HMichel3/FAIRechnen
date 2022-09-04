import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty } from 'ramda'
import { useRef, useEffect } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { AddGroupModalProps } from '.'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  groupName: z.string().trim().min(1),
  memberNames: z.object({ name: z.string() }).array(),
})

interface GroupFormValues {
  groupName: string
  memberNames: { name: string }[]
}

const defaultValues: GroupFormValues = { groupName: '', memberNames: [{ name: '' }] }

export const useAddGroupModal = (onDismiss: AddGroupModalProps['onDismiss']) => {
  const addGroup = usePersistedStore(s => s.addGroup)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const methods = useForm({ resolver: zodResolver(validationSchema), defaultValues })
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'memberNames' })
  const memberNamesFields = useWatch({ control: methods.control, name: 'memberNames' })
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  useEffect(() => {
    if (!isEmpty(memberNamesFields.at(-1)?.name)) {
      append({ name: '' })
      setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
      return
    }
    if (isEmpty(memberNamesFields.at(-2)?.name)) {
      remove(memberNamesFields.length - 1)
    }
  }, [memberNamesFields, append, remove])

  const onSubmit = methods.handleSubmit(({ groupName, memberNames }) => {
    addGroup(groupName, memberNames)
    setShowAnimation()
    onDismiss()
  })

  return { pageContentRef, fields, remove, onSubmit, methods }
}
