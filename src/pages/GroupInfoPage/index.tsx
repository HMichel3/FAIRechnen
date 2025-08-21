import { Share } from '@capacitor/share'
import {
  IonBackButton,
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
  useIonAlert,
  useIonModal,
} from '@ionic/react'
import { cartSharp, pencilSharp, personSharp, serverSharp, shareSharp, walletSharp } from 'ionicons/icons'
import { AnimatePresence } from 'motion/react'
import { trim } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { calculateMembersWithAmounts, cn } from '../../App/utils'
import { AddCompensationModal } from '../../components/AddCompensationModal'
import { AddFabButton } from '../../components/AddFabButton'
import { useAddFabButton } from '../../components/AddFabButton/useAddFabButton'
import { IncomeModal } from '../../components/IncomeModal'
import { MemberSegment } from '../../components/MemberSegment'
import { PaymentSegment } from '../../components/PaymentSegment'
import { mergeAndSortPayments } from '../../components/PaymentSegment/utils'
import { PurchaseModal } from '../../components/PurchaseModal'
import { Show } from '../../components/SolidComponents/Show'
import { SuccessAnimation } from '../../lotties/SuccessAnimation'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { generateBill } from './utils'

type GroupInfoPageProps = RouteComponentProps<{
  id: string
}>

export const GroupInfoPage = ({
  match: {
    params: { id: groupId },
  },
}: GroupInfoPageProps): JSX.Element => {
  const group = usePersistedStore(s => s.getGroup(groupId))
  const editGroupName = usePersistedStore(s => s.editGroupName)
  const addMember = usePersistedStore(s => s.addMember)
  const setSelectedGroup = useStore(s => s.setSelectedGroup)
  const clearSelectedGroup = useStore(s => s.clearSelectedGroup)
  const showAnimation = useStore(s => s.showAnimation)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const [presentEditGroupName] = useIonAlert()
  const [presentAddMember] = useIonAlert()
  const [showSegment, setShowSegment] = useState('members')

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

  const membersWithAmounts = useMemo(
    () => calculateMembersWithAmounts(group.members, group.purchases, group.incomes, group.compensations),
    [group.members, group.purchases, group.incomes, group.compensations]
  )

  const sortedPayments = useMemo(
    () => mergeAndSortPayments(group.purchases, group.incomes, group.compensations),
    [group.purchases, group.incomes, group.compensations]
  )

  // saves the selectedGroup onMount to make it accessible through the application
  useEffect(() => {
    setSelectedGroup({ ...group, membersWithAmounts, sortedPayments })
  }, [group, setSelectedGroup, membersWithAmounts, sortedPayments])

  // onUnmount
  useEffect(() => () => clearSelectedGroup(), [clearSelectedGroup])

  const onEditGroupName = () => {
    presentEditGroupName({
      header: 'Gruppe umbenennen',
      inputs: [{ name: 'groupName', value: group.name }],
      buttons: [
        { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
        {
          role: 'confirm',
          text: 'Speichern',
          handler: ({ groupName }) => {
            editGroupName(group.id, trim(groupName))
            setShowAnimation()
          },
        },
      ],
    })
  }

  const onAddMember = () => {
    presentAddMember({
      header: 'Mitglied hinzufügen',
      inputs: [{ cssClass: 'm-0', name: 'memberName', placeholder: 'Name eingeben' }],
      buttons: [
        { role: 'cancel', text: 'Abbrechen', cssClass: 'alert-button-cancel' },
        {
          role: 'confirm',
          text: 'Speichern',
          handler: ({ memberName }) => {
            addMember(group.id, trim(memberName))
            setShowAnimation()
          },
        },
      ],
    })
  }

  const onShareBill = () => {
    Share.share({
      title: 'FAIRechnen Rechnung',
      text: generateBill(group.name, group.members, group.purchases, group.incomes, group.compensations),
      dialogTitle: 'Rechnung teilen',
    })
  }

  return (
    <IonPage>
      <Show when={showBackdrop}>
        <div className='absolute inset-0 z-20 bg-black/60' onClick={onClickBackdrop} />
      </Show>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>{group.name}</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={onEditGroupName}>
              <IonIcon slot='icon-only' icon={pencilSharp} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={showSegment}>
            <IonSegmentButton value='members' onClick={() => setShowSegment('members')}>
              <IonLabel>
                <IonLabel>Mitglieder</IonLabel>
                <IonBadge
                  className={cn('bg-transparent text-[#a5a5a5]', { 'text-[#428cff]': showSegment === 'members' })}
                >
                  {group.members.length}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='payments' onClick={() => setShowSegment('payments')}>
              <IonLabel>
                <IonLabel>Historie</IonLabel>
                <IonBadge
                  className={cn('bg-transparent text-[#a5a5a5]', { 'text-[#428cff]': showSegment === 'payments' })}
                >
                  {group.purchases.length + group.incomes.length + group.compensations.length}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <AnimatePresence mode='wait'>
          {/* Key prop is needed for AnimatePresence to work correctly on 2 different Components */}
          {showSegment === 'members' && <MemberSegment key='members' />}
          {showSegment === 'payments' && <PaymentSegment key='payments' />}
        </AnimatePresence>
        <AddFabButton
          showFab={showFab}
          onClickFabButton={onClickFabButton}
          onClickFabButtonInList={onClickFabButtonInList}
        >
          {[
            {
              label: 'Mitglied hinzufügen',
              description: 'Neue Person, die sich beteiligt',
              icon: personSharp,
              onClick: onAddMember,
            },
            {
              label: 'Zahlung hinzufügen',
              description: 'Neue Zahlung zwischen den Personen',
              icon: walletSharp,
              onClick: showAddCompensationModal,
              disabled: group.members.length < 2,
            },
            {
              label: 'Einkommen hinzufügen',
              description: 'Geld wurde eingenommen (z.B. Pfand)',
              icon: serverSharp,
              onClick: showIncomeModal,
              disabled: group.members.length < 1,
            },
            {
              label: 'Einkauf hinzufügen',
              description: 'Geld wurde ausgegeben',
              icon: cartSharp,
              onClick: showPurchaseModal,
              disabled: group.members.length < 1,
            },
          ]}
        </AddFabButton>
        <IonFab className='z-10' vertical='bottom' horizontal='start' slot='fixed'>
          <IonFabButton onClick={onShareBill}>
            <IonIcon icon={shareSharp} />
          </IonFabButton>
        </IonFab>
      </IonContent>
      <Show when={showAnimation}>
        <SuccessAnimation />
      </Show>
    </IonPage>
  )
}
