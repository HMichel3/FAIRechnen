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
import { RouteComponentProps } from 'react-router'
import { PaymentSegment } from '../../components/PaymentSegment'
import { MemberSegment } from '../../components/MemberSegment'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { AddFabButton } from '../../components/AddFabButton'
import { useAddFabButton } from '../../components/AddFabButton/useAddFabButton'
import { SimpleSaveAlert } from '../../components/SimpleSaveAlert'
import { useCallback, useEffect, useState } from 'react'
import { PurchaseModal } from '../../components/PurchaseModal'
import { IncomeModal } from '../../components/IncomeModal'
import { AddCompensationModal } from '../../components/AddCompensationModal'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { generateBill } from './utils'
import { Share } from '@capacitor/share'
import './index.scss'

interface GroupInfoPageProps
  extends RouteComponentProps<{
    id: string
  }> {}

export const GroupInfoPage = ({
  match: {
    params: { id: groupId },
  },
}: GroupInfoPageProps): JSX.Element => {
  const group = usePersistedStore(useCallback(store => store.getGroup(groupId), [groupId]))
  const editGroup = usePersistedStore.useEditGroupName()
  const addMember = usePersistedStore.useAddMember()
  const setSelectedGroup = useStore.useSetSelectedGroup()
  const clearSelectedGroup = useStore.useClearSelectedGroup()

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

  useEffect(() => {
    // saves the selected Group in the store, to make it accessible
    setSelectedGroup(group)
  }, [group, setSelectedGroup])

  // onUnmount
  useEffect(() => () => clearSelectedGroup(), [clearSelectedGroup])

  const onShareBill = () => {
    Share.share({
      title: 'FAIRechnen Rechnung',
      text: generateBill(group.name, group.members, group.purchases, group.incomes, group.compensations),
      dialogTitle: 'Rechnung teilen',
    })
  }

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
                  {group.members.length}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='payments'>
              <IonLabel>
                <IonLabel>Historie</IonLabel>
                <IonBadge className={clsx('no-background', { 'unselected-color': showSegment !== 'payments' })}>
                  {group.purchases.length + group.incomes.length + group.compensations.length}
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
          onSave={newValue => editGroup(groupId, newValue)}
          value={group.name}
        />
        <SimpleSaveAlert
          isOpen={showAddMemberAlert}
          header='Neues Mitglied'
          setIsOpen={setShowAddMemberAlert}
          onSave={newValue => addMember(groupId, newValue)}
        />
        <AddFabButton {...{ showFab, onClickFabButton, onClickFabButtonInList, onClickBackdrop }}>
          {[
            {
              label: 'Zahlung hinzufügen',
              description: 'Neue Zahlung zwischen den Personen',
              icon: walletSharp,
              onClick: () => showAddCompensationModal(),
              disabled: group.members.length < 2,
            },
            {
              label: 'Einkommen hinzufügen',
              description: 'Geld wurde eingenommen (z.B. Pfand)',
              icon: serverSharp,
              onClick: () => showIncomeModal(),
              disabled: group.members.length < 1,
            },
            {
              label: 'Einkauf hinzufügen',
              description: 'Geld wurde ausgegeben',
              icon: cartSharp,
              onClick: () => showPurchaseModal(),
              disabled: group.members.length < 1,
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
