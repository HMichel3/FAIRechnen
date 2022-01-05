import { IonAlert, IonReorderGroup } from '@ionic/react'
import { map } from 'ramda'
import { closeSharp, helpCircleSharp, peopleSharp, repeatSharp } from 'ionicons/icons'
import { SlidingListItem } from '../../components/SlidingListItem'
import { PageLayout } from '../../components/PageLayout'
import { PageContent } from '../../components/PageLayout/PageContent'
import { PageFooter } from '../../components/PageLayout/PageFooter'
import { PageHeader } from '../../components/PageLayout/PageHeader'
import { SmallLabelComponent } from '../../components/SlidingListItem/SmallLabelComponent'
import { ButtonWithSaveIcon } from '../../components/ButtonWithSaveIcon'
import { InfoSlides } from '../../components/InfoSlides'
import { useGroupPage } from './useGroupPage'
import { displayCurrencyValue, equalsLast } from '../../App/utils'
import { useState } from 'react'

export const GroupPage = (): JSX.Element => {
  const {
    groups,
    showInfoSlides,
    showDeleteGroupAlert,
    selectedGroupId,
    showAddGroupModal,
    deleteGroup,
    setShowDeleteGroupAlert,
    onDeleteGroup,
    onToggleDarkMode,
    onToggleShowInfoSlides,
    calculateGroupTotalAmount,
    setGroups,
  } = useGroupPage()
  const [reorder, setReorder] = useState(false)

  if (showInfoSlides) {
    return (
      <PageLayout>
        <PageContent>
          <InfoSlides onToggleShowInfoSlides={onToggleShowInfoSlides} />
        </PageContent>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title='Gruppen'
        onToggleDarkMode={onToggleDarkMode}
        menuButtons={[
          { icon: reorder ? closeSharp : repeatSharp, onClick: () => setReorder(prevState => !prevState) },
          { icon: helpCircleSharp, onClick: onToggleShowInfoSlides },
        ]}
      />
      <PageContent>
        <IonReorderGroup disabled={!reorder} onIonItemReorder={({ detail }) => setGroups(detail.complete(groups))}>
          {map(
            group => (
              <SlidingListItem
                key={group.id}
                label={group.name}
                routerLink={`/groups/${group.id}`}
                onDelete={() => onDeleteGroup(group.id)}
                icon={peopleSharp}
                labelComponent={
                  <SmallLabelComponent>{displayCurrencyValue(calculateGroupTotalAmount(group.id))}</SmallLabelComponent>
                }
                lines={equalsLast(group, groups) ? 'none' : undefined}
                reorder={reorder}
              />
            ),
            groups
          )}
        </IonReorderGroup>
        <IonAlert
          cssClass='delete-alert'
          isOpen={showDeleteGroupAlert}
          onDidDismiss={() => setShowDeleteGroupAlert(false)}
          header='Wollen Sie die Gruppe wirklich löschen?'
          message='Mit dem Löschen der Gruppe gehen sämtliche Informationen bezüglich der Mitglieder, der Einkäufe sowie möglicher offener Rechnungen verloren!'
          buttons={[
            { role: 'cancel', text: 'Abbrechen' },
            { text: 'Löschen', handler: () => deleteGroup(selectedGroupId) },
          ]}
        />
      </PageContent>
      <PageFooter>
        <ButtonWithSaveIcon icon={peopleSharp} onClick={() => showAddGroupModal()}>
          Gruppe hinzufügen
        </ButtonWithSaveIcon>
      </PageFooter>
    </PageLayout>
  )
}
