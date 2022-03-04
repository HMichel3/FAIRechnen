import {
  IonBackButton,
  IonBackdrop,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonModal,
} from '@ionic/react'
import { cartSharp, serverSharp, pencilSharp, personSharp, shareSharp, walletSharp } from 'ionicons/icons'
import { all, propEq } from 'ramda'
import { RouteComponentProps } from 'react-router'
import { PaymentSegment } from '../../components/PaymentSegment'
import { MemberSegment } from '../../components/MemberSegment'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { CompleteGroup } from '../../App/types'
import { useGroupInfoPage } from './useGroupInfoPage'
import { AddFabButton } from '../../components/AddFabButton'
import { useAddFabButton } from '../../components/AddFabButton/useAddFabButton'
import { SimpleSaveAlert } from '../../components/SimpleSaveAlert'
import { useState } from 'react'
import { PurchaseModal } from '../../components/PurchaseModal'
import { IncomeModal } from '../../components/IncomeModal'
import { AddCompensationModal } from '../../components/AddCompensationModal'
import './index.scss'

interface GroupInfoPageProps
  extends RouteComponentProps<{
    id: CompleteGroup['groupId']
  }> {}

export const GroupInfoPage = ({
  match: {
    params: { id: groupId },
  },
}: GroupInfoPageProps): JSX.Element => {
  const { group, groupMembers, groupPayments, onEditGroupName, onAddNewMember, onShareBill } = useGroupInfoPage(groupId)
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
    <IonPage>
      {showBackdrop && <IonBackdrop className='custom-backdrop' tappable={true} onIonBackdropTap={onClickBackdrop} />}
      <IonHeader>
        <IonToolbar color='dark'>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>{group.name}</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={() => setShowEditGroupNameAlert(true)}>
              <IonIcon slot='icon-only' icon={pencilSharp} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar color='dark'>
          <IonSegment value={showSegment} onIonChange={({ detail }) => setShowSegment(detail.value!)}>
            <IonSegmentButton value='members'>
              <IonLabel>
                <IonLabel>Mitglieder</IonLabel>
                <IonBadge className={clsx('no-background', { 'unselected-color': showSegment !== 'members' })}>
                  {groupMembers.length}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='payments'>
              <IonLabel>
                <IonLabel>Historie</IonLabel>
                <IonBadge className={clsx('no-background', { 'unselected-color': showSegment !== 'payments' })}>
                  {groupPayments.length}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
          value={group.name}
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
              label: 'Zahlung hinzufügen',
              description: 'Neue Zahlung zwischen den Personen',
              icon: walletSharp,
              onClick: () => showAddCompensationModal(),
              disabled: groupMembers.length < 2 || all(propEq('amount', 0), groupMembers),
            },
            {
              label: 'Einkommen hinzufügen',
              description: 'Geld wurde eingenommen (z.B. Pfand)',
              icon: serverSharp,
              onClick: () => showIncomeModal(),
              disabled: groupMembers.length < 1,
            },
            {
              label: 'Einkauf hinzufügen',
              description: 'Geld wurde ausgegeben',
              icon: cartSharp,
              onClick: () => showPurchaseModal(),
              disabled: groupMembers.length < 1,
            },
            {
              label: 'Mitglied hinzufügen',
              description: 'Neue Person, die sich beteiligt',
              icon: personSharp,
              onClick: () => setShowAddMemberAlert(true),
            },
          ]}
        </AddFabButton>
        {/* style needed, because otherwise you can click the button, even though the other FabButton is enabled */}
        <IonFab vertical='bottom' horizontal='start' slot='fixed' style={{ zIndex: 10 }}>
          <IonFabButton color='medium' onClick={onShareBill}>
            <IonIcon icon={shareSharp} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}
