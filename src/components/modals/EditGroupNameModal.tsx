import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { pick } from 'remeda'
import { z } from 'zod'
import { Group } from '../../stores/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { FormInput } from '../ui/formComponents/FormInput'
import { AlertModal } from './AlertModal'

type EditGroupNameModalProps = {
  onDismiss: () => void
  selected: Group
}

const validationSchema = z.object({
  name: z.string().trim().min(1),
})

const defaultValues = (selected: Group): z.infer<typeof validationSchema> => {
  return pick(selected, ['name'])
}

export const EditGroupNameModal = ({ onDismiss, selected }: EditGroupNameModalProps) => {
  const editGroupName = usePersistedStore(s => s.editGroupName)
  const showAnimation = useStore(s => s.showAnimation)
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues(selected),
  })

  const onSubmit = handleSubmit(({ name }) => {
    editGroupName(selected.id, name)
    showAnimation()
    onDismiss()
  })

  return (
    <>
      <AlertModal.Header title='Gruppe umbenennen' />
      <AlertModal.Body>
        <form id='group-name-form' onSubmit={onSubmit}>
          <div className='my-2'>
            <FormInput label='Gruppenname*' name='name' control={control} />
          </div>
        </form>
      </AlertModal.Body>
      <AlertModal.Footer form='group-name-form' onDismiss={onDismiss} />
    </>
  )
}
