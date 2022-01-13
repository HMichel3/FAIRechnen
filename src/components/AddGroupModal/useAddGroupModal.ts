import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty, last, forEach } from 'ramda'
import { useRef, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { AddGroupModalProps } from '.'
import { Group, Member } from '../../App/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

const validationSchema = z.object({
  groupName: z.string().min(1, { message: 'Pflichtfeld!' }),
  almostMembers: z.object({ name: z.string() }).array(),
})

interface FormValues {
  groupName: Group['name']
  almostMembers: Pick<Member, 'name'>[]
}

const defaultValues: FormValues = { groupName: '', almostMembers: [{ name: '' }] }

export const useAddGroupModal = (onDismiss: AddGroupModalProps['onDismiss']) => {
  const addGroup = usePersistedStore.useAddGroup()
  const addMember = usePersistedStore.useAddMember()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const { watch, handleSubmit, control, formState } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'almostMembers' })
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  useEffect(() => {
    const adjustFieldArray = watch(({ almostMembers }, { name }) => {
      if (name === 'groupName' || isEmpty(last(almostMembers)!.name)) return
      append({ name: '' })
      setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
    })
    return () => adjustFieldArray.unsubscribe()
  }, [watch, append])

  const onSubmit = handleSubmit(({ groupName, almostMembers }) => {
    const groupId = addGroup(groupName)
    forEach(({ name }) => !isEmpty(name) && addMember(groupId, name), almostMembers)
    showAnimationOnce()
    onDismiss()
  })

  return { pageContentRef, formState, fields, remove, onSubmit, control }
}
