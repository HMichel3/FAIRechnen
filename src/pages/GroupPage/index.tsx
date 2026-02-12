import { FilePicker } from '@capawesome/capacitor-file-picker'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonModal,
} from '@ionic/react'
import { addSharp, closeSharp, peopleSharp, repeatSharp, swapHorizontalSharp } from 'ionicons/icons'
import { isEmpty } from 'ramda'
import { useState } from 'react'
import { isIdInArray, parseError } from '../../App/utils'
import { AddGroupModal } from '../../components/AddGroupModal'
import { FabButton } from '../../components/FabButton'
import { GroupPageList } from '../../components/GroupPageList'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { extractGroupFromFile } from './utils'

export const GroupPage = (): JSX.Element => {
  const groups = usePersistedStore(s => s.groups)
  const importNewGroup = usePersistedStore(s => s.importNewGroup)
  const importExistingGroup = usePersistedStore(s => s.importExistingGroup)
  const copyImportedGroup = usePersistedStore(s => s.copyImportedGroup)
  const [reorder, setReorder] = useState(false)
  const [showAddGroupModal, dismissAddGroupModal] = useIonModal(AddGroupModal, {
    onDismiss: () => dismissAddGroupModal(),
  })
  const [presentGroupImport] = useIonAlert()

  const pickJsonFile = async () => {
    try {
      const result = await FilePicker.pickFiles({ types: ['application/json'], limit: 1 })
      if (isEmpty(result.files)) return
      const extractedGroup = await extractGroupFromFile(result.files[0])
      if (isIdInArray(extractedGroup.id, groups)) {
        presentGroupImport({
          header: `Möchten Sie die Gruppe wirklich überschreiben?`,
          message: `Die Gruppe "${extractedGroup.name}" existiert bereits. Mit dem Überschreiben gehen sämtliche Informationen verloren!`,
          buttons: [
            { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
            { role: 'confirm', text: 'Überschreiben', handler: () => importExistingGroup(extractedGroup) },
            { role: 'confirm', text: 'Kopie anlegen', handler: () => copyImportedGroup(extractedGroup) },
          ],
        })
        return
      }
      importNewGroup(extractedGroup)
      presentGroupImport({
        header: 'Gruppe erfolgreich importiert',
        message: 'Die Gruppe wurde erfolgreich importiert und kann in der Gruppenübersicht ausgewählt werden.',
        buttons: [{ role: 'cancel', text: 'OK' }],
      })
    } catch (error) {
      const parsedError = parseError(error)
      presentGroupImport({
        header: parsedError.name,
        message: parsedError.message,
        buttons: [{ role: 'cancel', text: 'OK' }],
      })
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
            <IonButton disabled={groups.length < 2} onClick={() => setReorder(prevState => !prevState)}>
              <IonIcon slot='icon-only' icon={reorder ? closeSharp : repeatSharp} />
            </IonButton>
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
              onClick: showAddGroupModal,
            },
          ]}
        </FabButton>
      </IonContent>
    </IonPage>
  )
}
