import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  SelectChangeEventDetail,
} from '@ionic/react'
import clsx from 'clsx'
import { closeSharp } from 'ionicons/icons'
import { isEmpty } from 'ramda'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { findItem } from '../../../App/utils'
import { isDark } from '../../../pages/GroupPage/utils'
import { usePersistedStore } from '../../../stores/usePersistedStore'
import { Show } from '../../CustomSolidComponents/Show'
import { GroupTemplateButton } from './GroupTemplateButton'
import { GroupFormValues } from '../useAddGroupModal'

interface GroupTemplateProps {
  replace: (
    value:
      | Partial<{
          name: string
        }>
      | Partial<{
          name: string
        }>[]
  ) => void
}

export const GroupTemplate = ({ replace }: GroupTemplateProps) => {
  const groupTemplates = usePersistedStore.useGroupTemplates()
  const addGroupTemplate = usePersistedStore.useAddGroupTemplate()
  const deleteGroupTemplate = usePersistedStore.useDeleteGroupTemplate()
  const theme = usePersistedStore.useTheme()
  const [groupTemplateId, setGroupTemplateId] = useState('')
  const { reset, setValue, getValues } = useFormContext<GroupFormValues>()

  const onSetGroupTemplate = (event: CustomEvent<SelectChangeEventDetail<string>>) => {
    setGroupTemplateId(event.detail.value)
    if (isEmpty(event.detail.value)) return reset({ groupName: '', memberNames: [{ name: '' }] })
    const foundTemplate = findItem(event.detail.value, groupTemplates)
    if (!foundTemplate) return
    setValue('groupName', foundTemplate.name)
    const memberNames = foundTemplate.memberNames.map(memberName => ({ name: memberName }))
    replace(memberNames)
  }

  const onAddGroupTemplate = () => {
    const memberNames = getValues('memberNames').map(memberName => memberName.name)
    const groupTemplateId = addGroupTemplate(getValues('groupName'), memberNames)
    setGroupTemplateId(groupTemplateId)
  }

  const onDeleteGroupTemplate = () => {
    deleteGroupTemplate(groupTemplateId)
    reset({ groupName: '', memberNames: [{ name: '' }] })
    setGroupTemplateId('')
  }

  return (
    <>
      <IonItem className='form-component default-margin' fill='outline'>
        <IonLabel position='stacked' color={clsx({ light: isDark(theme) })}>
          Vorlage
        </IonLabel>
        <IonSelect
          interface='popover'
          interfaceOptions={{ cssClass: 'basic-select-popover' }}
          value={groupTemplateId}
          onIonChange={onSetGroupTemplate}
          placeholder='Gespeicherte Vorlage auswählen'
          disabled={isEmpty(groupTemplates)}
        >
          {groupTemplates.map(option => (
            <IonSelectOption key={option.id} value={option.id}>
              {option.name}
            </IonSelectOption>
          ))}
        </IonSelect>
        <Show when={!isEmpty(groupTemplateId)}>
          <IonButton
            slot='end'
            color='danger'
            fill='clear'
            style={{ marginLeft: 16, zIndex: 2 }}
            onClick={() => setGroupTemplateId('')}
          >
            <IonIcon slot='icon-only' icon={closeSharp} />
          </IonButton>
        </Show>
      </IonItem>
      <GroupTemplateButton
        groupTemplates={groupTemplates}
        groupTemplateId={groupTemplateId}
        onAddGroupTemplate={onAddGroupTemplate}
        onDeleteGroupTemplate={onDeleteGroupTemplate}
      />
    </>
  )
}
