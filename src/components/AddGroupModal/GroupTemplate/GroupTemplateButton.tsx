import { IconButton } from '../../IconButton'
import { useFormContext } from 'react-hook-form'
import { saveSharp, trashBinSharp } from 'ionicons/icons'
import { isEmpty } from 'ramda'
import { GroupFormValues } from '../useAddGroupModal'
import { GroupTemplate } from '../../../stores/types'
import { isTemplateInGroupTemplates } from './utils'

interface GroupTemplateButtonProps {
  groupTemplates: GroupTemplate[]
  groupTemplateId: string
  onAddGroupTemplate: () => void
  onDeleteGroupTemplate: () => void
}

export const GroupTemplateButton = ({
  groupTemplates,
  groupTemplateId,
  onAddGroupTemplate,
  onDeleteGroupTemplate,
}: GroupTemplateButtonProps): JSX.Element => {
  const { watch } = useFormContext<GroupFormValues>()

  switch (true) {
    case !isEmpty(watch('groupName')) && !isTemplateInGroupTemplates(watch('groupName'), groupTemplates):
      return (
        <IconButton
          className='default-margin'
          color='success'
          onClick={onAddGroupTemplate}
          fill='outline'
          size='small'
          icon={saveSharp}
        >
          Als Vorlage speichern
        </IconButton>
      )
    case !isEmpty(groupTemplateId) && isTemplateInGroupTemplates(watch('groupName'), groupTemplates):
      return (
        <IconButton
          className='default-margin'
          color='danger'
          onClick={onDeleteGroupTemplate}
          fill='outline'
          size='small'
          icon={trashBinSharp}
        >
          Vorlage löschen
        </IconButton>
      )
    default:
      return (
        <IconButton className='default-margin' color='success' fill='outline' size='small' icon={saveSharp} disabled>
          Als Vorlage speichern
        </IconButton>
      )
  }
}
