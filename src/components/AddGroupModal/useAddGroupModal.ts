import { isEmpty, last, forEach } from 'ramda'
import { useRef, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { AddGroupModalProps } from '.'
import { Group, Member } from '../../App/types'
import { useSetFocus } from '../../hooks/useSetFocus'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'

interface FormValues {
  groupName: Group['name']
  almostMembers: Pick<Member, 'name'>[]
}

const defaultValues: FormValues = { groupName: '', almostMembers: [{ name: '' }] }

export const useAddGroupModal = (onDismiss: AddGroupModalProps['onDismiss']) => {
  const addGroup = usePersistedStore.useAddGroup()
  const addMember = usePersistedStore.useAddMember()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const { register, watch, handleSubmit, control, formState } = useForm({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control, name: 'almostMembers' })
  const groupNameRef = useRef<HTMLIonInputElement | null>(null)
  const { ref: firstInputRef, ...firstInputRest } = register('groupName', { required: 'Pflichtfeld!' })
  const pageContentRef = useRef<HTMLIonContentElement>(null)

  useSetFocus(groupNameRef, 500)

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

  return { pageContentRef, firstInputRef, firstInputRest, groupNameRef, formState, fields, register, remove, onSubmit }
}
