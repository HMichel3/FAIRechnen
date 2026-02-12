import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
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
import { pdf } from '@react-pdf/renderer'
import {
  addSharp,
  cartSharp,
  documentTextSharp,
  pencilSharp,
  personSharp,
  serverSharp,
  shareSocialSharp,
  swapHorizontalSharp,
  walletSharp,
} from 'ionicons/icons'
import { AnimatePresence } from 'motion/react'
import { trim } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { stringify } from 'superjson'
import { calculateMembersWithAmounts, cn, createFileName } from '../../App/utils'
import { AddCompensationModal } from '../../components/AddCompensationModal'
import { generateCompensationChain } from '../../components/AddCompensationModal/utils'
import { BillPdf } from '../../components/BillPdf'
import { FabButton } from '../../components/FabButton'
import { IncomeModal } from '../../components/IncomeModal'
import { MemberModal } from '../../components/MemberModal'
import { MemberSegment } from '../../components/MemberSegment'
import { PaymentSegment } from '../../components/PaymentSegment'
import { mergeAndSortPayments } from '../../components/PaymentSegment/utils'
import { PurchaseModal } from '../../components/PurchaseModal'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { blobToBase64 } from './utils'

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
  const setSelectedGroup = useStore(s => s.setSelectedGroup)
  const clearSelectedGroup = useStore(s => s.clearSelectedGroup)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const [presentEditGroupName] = useIonAlert()
  const [showSegment, setShowSegment] = useState('members')

  const [showMemberModal, dismissMemberModal] = useIonModal(MemberModal, {
    onDismiss: () => dismissMemberModal(),
  })
  const [showPurchaseModal, dismissPurchaseModal] = useIonModal(PurchaseModal, {
    onDismiss: () => dismissPurchaseModal(),
  })
  const [showIncomeModal, dismissIncomeModal] = useIonModal(IncomeModal, {
    onDismiss: () => dismissIncomeModal(),
  })
  const [showAddCompensationModal, dismissAddCompensationModal] = useIonModal(AddCompensationModal, {
    onDismiss: () => dismissAddCompensationModal(),
  })

  const membersWithAmounts = useMemo(
    () => calculateMembersWithAmounts(group.members, group.purchases, group.incomes, group.compensations),
    [group.members, group.purchases, group.incomes, group.compensations]
  )

  const sortedPayments = useMemo(
    () => mergeAndSortPayments(group.purchases, group.incomes, group.compensations),
    [group.purchases, group.incomes, group.compensations]
  )

  const compensationChain = useMemo(() => generateCompensationChain(membersWithAmounts), [membersWithAmounts])

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

  const onShareGroupOverview = async () => {
    const pdfBlob = await pdf(
      <BillPdf
        name={group.name}
        purchases={group.purchases}
        incomes={group.incomes}
        membersWithAmounts={membersWithAmounts}
        sortedPayments={sortedPayments}
        compensationChain={compensationChain}
      />
    ).toBlob()
    const fileName = createFileName(group.name, 'pdf')
    const { uri: filePath } = await Filesystem.writeFile({
      path: fileName,
      data: await blobToBase64(pdfBlob),
      directory: Directory.Cache,
    })
    await Share.share({
      title: `FAIRechnen - ${group.name} (PDF)`,
      dialogTitle: `${group.name} teilen`,
      files: [filePath],
    })
  }

  const onShareGroupData = async () => {
    const fileName = createFileName(group.name, 'json')
    const { uri: filePath } = await Filesystem.writeFile({
      path: fileName,
      data: stringify(group),
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    })
    await Share.share({
      title: `FAIRechnen - ${group.name} (JSON)`,
      dialogTitle: `${group.name} teilen`,
      files: [filePath],
    })
  }

  return (
    <IonPage>
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
        <FabButton horizontal='start' icon={shareSocialSharp}>
          {[
            {
              label: 'Gruppe exportieren (JSON)',
              description: 'Daten für späteren Import exportieren',
              icon: swapHorizontalSharp,
              onClick: onShareGroupData,
            },
            {
              label: 'Gruppen teilen (PDF)',
              description: 'Details und Zahlungsvorschläge teilen',
              icon: documentTextSharp,
              onClick: onShareGroupOverview,
            },
          ]}
        </FabButton>
        <FabButton horizontal='end' icon={addSharp}>
          {[
            {
              label: 'Mitglied hinzufügen',
              description: 'Neue Person, die sich beteiligt',
              icon: personSharp,
              onClick: showMemberModal,
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
        </FabButton>
        {/* can be used to preview the PDF in the browser for making easy adjustments */}
        {/* {renderPdf(
          <BillPdf
            name={group.name}
            purchases={group.purchases}
            incomes={group.incomes}
            membersWithAmounts={membersWithAmounts}
            sortedPayments={sortedPayments}
            compensationChain={compensationChain}
          />,
          true
        )} */}
      </IonContent>
    </IonPage>
  )
}
