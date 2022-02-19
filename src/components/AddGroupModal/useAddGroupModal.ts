import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty, last } from 'ramda'
import { useRef, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { AddGroupModalProps } from '.'
import { groupDTO } from '../../dtos/groupDTO'
import { memberDTO } from '../../dtos/memberDTO'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  groupName: z.string().min(1, { message: 'Pflichtfeld!' }),
  memberNames: z.object({ name: z.string() }).array(),
})

interface GroupFormValues {
  groupName: string
  memberNames: { name: string }[]
}

const defaultValues: GroupFormValues = { groupName: '', memberNames: [{ name: '' }] }

export const useAddGroupModal = (onDismiss: AddGroupModalProps['onDismiss']) => {
  const addGroup = usePersistedStore.useAddGroup()
  const addMember = usePersistedStore.useAddMember()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const { watch, handleSubmit, control, formState } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'memberNames' })
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  useEffect(() => {
    const adjustFieldArray = watch(({ memberNames }, { name }) => {
      if (name === 'groupName' || isEmpty(last(memberNames)!.name)) return
      append({ name: '' })
      setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
    })
    return () => adjustFieldArray.unsubscribe()
  }, [watch, append])

  const onSubmit = handleSubmit(({ groupName, memberNames }) => {
    const newGroup = groupDTO({ name: groupName })
    addGroup(newGroup)
    memberNames.forEach(({ name }) => {
      if (isEmpty(name)) return
      const newMember = memberDTO({ groupId: newGroup.groupId, name })
      addMember(newMember)
    })
    showAnimationOnce()
    onDismiss()
  })

  return { pageContentRef, formState, fields, remove, onSubmit, control }
}
