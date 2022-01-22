import { IonBackdrop, IonBadge, IonLabel, IonSegment, IonSegmentButton, IonToolbar, useIonModal } from '@ionic/react'
import { cartSharp, serverSharp, pencilSharp, personSharp, shareSharp, walletSharp } from 'ionicons/icons'
import { all, propEq } from 'ramda'
import { RouteComponentProps } from 'react-router'
import { PageLayout } from '../../components/PageLayout'
import { PaymentSegment } from '../../components/PaymentSegment'
import { MemberSegment } from '../../components/MemberSegment'
import { PageContent } from '../../components/PageLayout/PageContent'
import { PageHeader } from '../../components/PageLayout/PageHeader'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { Group } from '../../App/types'
import { useGroupInfoPage } from './useGroupInfoPage'
import { AddFabButton } from '../../components/AddFabButton'
import { useAddFabButton } from '../../components/AddFabButton/useAddFabButton'
import { SimpleSaveAlert } from '../../components/SimpleSaveAlert'
import { useState } from 'react'
import { PurchaseModal } from '../../components/PurchaseModal'
import { IncomeModal } from '../../components/IncomeModal'
import { AddCompensationModal } from '../../components/AddCompensationModal'

interface GroupInfoPageProps
  extends RouteComponentProps<{
    id: Group['id']
  }> {}

export const GroupInfoPage = ({
  match: {
    params: { id: groupId },
  },
}: GroupInfoPageProps): JSX.Element => {
  const { selectedGroup, onEditGroupName, onAddNewMember, onShareBill } = useGroupInfoPage(groupId)
  const [showSegment, setShowSegment] = useState('members')
  const [showEditGroupNameAlert, setShowEditGroupNameAlert] = useState(false)
  const [showAddMemberAlert, setShowAddMemberAlert] = useState(false)
  const [showPurchaseModal, dismissPurchaseModal] = useIonModal(PurchaseModal, {
    onDismiss: () => dismissPurchaseModal(),
  })
  const [showIncomeModal, dismissIncomeModal] = useIonModal(IncomeModal, {
    onDismiss: () => dismissIncomeModal(),
  })
  const [showAddCompensationModal, dismissAddCompensationModal] = useIonModal(AddCompensationModal, {
    onDismiss: () => dismissAddCompensationModal(),
  })
  const { showFab, showBackdrop, onClickFabButton, onClickFabButtonInList, onClickBackdrop } = useAddFabButton()

  return (
    <PageLayout>
      {showBackdrop && <IonBackdrop className='custom-backdrop' tappable={true} onIonBackdropTap={onClickBackdrop} />}
      <PageHeader
        title={selectedGroup.group.name}
        backButton
        menuButtons={[
          { icon: pencilSharp, onClick: () => setShowEditGroupNameAlert(true) },
          { icon: shareSharp, onClick: onShareBill },
        ]}
      >
        <IonToolbar color='dark'>
          <IonSegment value={showSegment} onIonChange={({ detail }) => setShowSegment(detail.value!)}>
            <IonSegmentButton value='members'>
              <IonLabel>
                <span>Mitglieder</span>
                <IonBadge className={clsx('no-background', { 'unselected-color': showSegment !== 'members' })}>
                  {selectedGroup.groupMembers.length}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='payments'>
              <IonLabel>
                <span>Historie</span>
                <IonBadge className={clsx('no-background', { 'unselected-color': showSegment !== 'payments' })}>
                  {selectedGroup.groupPayments.length}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </PageHeader>
      <PageContent>
        <AnimatePresence exitBeforeEnter>
          {/* Key prop is needed for AnimatePresence to work correctly on 2 different Components */}
          {showSegment === 'members' && <MemberSegment key='members' />}
          {showSegment === 'payments' && <PaymentSegment key='payments' />}
        </AnimatePresence>
        <SimpleSaveAlert
          isOpen={showEditGroupNameAlert}
          header='Gruppe umbenennen'
          setIsOpen={setShowEditGroupNameAlert}
          onSave={onEditGroupName}
          value={selectedGroup.group.name}
        />
        <SimpleSaveAlert
          isOpen={showAddMemberAlert}
          header='Neues Mitglied'
          setIsOpen={setShowAddMemberAlert}
          onSave={onAddNewMember}
        />
        <AddFabButton {...{ showFab, onClickFabButton, onClickFabButtonInList, onClickBackdrop }}>
          {[
            {
              text: 'Zahlung hinzufügen',
              icon: walletSharp,
              onClick: () => showAddCompensationModal(),
              disabled: selectedGroup.groupMembers.length < 2 || all(propEq('amount', 0), selectedGroup.groupMembers),
            },
            {
              text: 'Einkommen hinzufügen',
              icon: serverSharp,
              onClick: () => showIncomeModal(),
              disabled: selectedGroup.groupMembers.length < 2,
            },
            {
              text: 'Einkauf hinzufügen',
              icon: cartSharp,
              onClick: () => showPurchaseModal(),
              disabled: selectedGroup.groupMembers.length < 2,
            },
            {
              text: 'Mitglied hinzufügen',
              icon: personSharp,
              onClick: () => setShowAddMemberAlert(true),
            },
          ]}
        </AddFabButton>
      </PageContent>
    </PageLayout>
  )
}
