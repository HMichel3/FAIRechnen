import { FilePicker } from '@capawesome/capacitor-file-picker'
import { IonAlert, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { addSharp, closeSharp, peopleSharp, repeatSharp, swapHorizontalSharp } from 'ionicons/icons'
import { isEmpty, not } from 'ramda'
import { useState } from 'react'
import { HintAlert } from '../components/alerts/HintAlert'
import { GroupPageList } from '../components/pageLists/GroupPageList'
import { FabButton } from '../components/ui/FabButton'
import { IconButton } from '../components/ui/IconButton'
import { useOverlay } from '../hooks/useOverlay'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { Group } from '../types/store'
import { isIdInArray, parseError } from '../utils/common'
import { extractGroupFromFile } from '../utils/file'

export const GroupPage = () => {
  const groups = usePersistedStore(s => s.groups)
  const importNewGroup = usePersistedStore(s => s.importNewGroup)
  const importExistingGroup = usePersistedStore(s => s.importExistingGroup)
  const copyImportedGroup = usePersistedStore(s => s.copyImportedGroup)
  const showAnimation = useStore(s => s.showAnimation)
  const importErrorOverlay = useOverlay<Error>()
  const groupExistsOverlay = useOverlay<Group>()
  const [reorder, setReorder] = useState(false)

  const pickJsonFile = async () => {
    try {
      const result = await FilePicker.pickFiles({ types: ['application/json'], limit: 1 })
      if (isEmpty(result.files)) return
      const extractedGroup = await extractGroupFromFile(result.files[0])
      if (isIdInArray(extractedGroup.id, groups)) {
        groupExistsOverlay.onSelect(extractedGroup)
        return
      }
      importNewGroup(extractedGroup)
      showAnimation()
    } catch (error) {
      const parsedError = parseError(error)
      importErrorOverlay.onSelect(parsedError)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Gruppenübersicht</IonTitle>
          <IonButtons slot='end'>
            <IconButton
              icon={reorder ? closeSharp : repeatSharp}
              disabled={groups.length < 2}
              onClick={() => setReorder(not)}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <GroupPageList reorder={reorder} />
        <FabButton className='bottom-tabs' horizontal='end' icon={addSharp}>
          {[
            {
              label: 'Gruppe importieren (JSON)',
              description: 'Vorher exportierte Daten importieren',
              icon: swapHorizontalSharp,
              onClick: pickJsonFile,
            },
            {
              label: 'Gruppe erstellen',
              description: 'Neue Gruppe erstellen',
              icon: peopleSharp,
              routerLink: '/groups/add',
            },
          ]}
        </FabButton>
      </IonContent>
      <HintAlert
        overlay={importErrorOverlay}
        header={importErrorOverlay.selected?.name ?? ''}
        message={importErrorOverlay.selected?.message ?? ''}
      />
      <IonAlert
        cssClass='custom-alert'
        isOpen={groupExistsOverlay.isOpen}
        onDidDismiss={groupExistsOverlay.onDidDismiss}
        header={`„${groupExistsOverlay.selected?.name}“ existiert bereits`}
        message='Möchtest du die Gruppe überschreiben oder eine Kopie anlegen? Beim Überschreiben gehen alle bisherigen Daten verloren.'
        buttons={[
          { role: 'confirm', text: 'Kopie anlegen', handler: () => copyImportedGroup(groupExistsOverlay.selected!) },
          { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-light' },
          {
            role: 'confirm',
            text: 'Überschreiben',
            cssClass: 'alert-button-danger',
            handler: () => importExistingGroup(groupExistsOverlay.selected!),
          },
        ]}
      />
    </IonPage>
  )
}
