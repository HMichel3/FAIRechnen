import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
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
import { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { stringify } from 'superjson'
import { AlertModal } from '../components/modals/AlertModal'
import { EditGroupNameModal } from '../components/modals/EditGroupNameModal'
import { BillPdf } from '../components/pdf/BillPdf'
import { MemberSegment } from '../components/segments/MemberSegment'
import { PaymentSegment } from '../components/segments/PaymentSegment'
import { FabButton } from '../components/ui/FabButton'
import { IconButton } from '../components/ui/IconButton'
import { useOverlay } from '../hooks/useOverlay'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { Group } from '../types/store'
import { calculateMembersWithAmounts } from '../utils/calculation'
import { cn, createFileName } from '../utils/common'
import { generateCompensationChain } from '../utils/compensation'
import { blobToBase64 } from '../utils/file'
import { mergeAndSortPayments } from '../utils/payment'

type GroupInfoPageProps = RouteComponentProps<{
  id: string
}>

export const GroupInfoPage = ({
  match: {
    params: { id: groupId },
  },
}: GroupInfoPageProps) => {
  const group = usePersistedStore(s => s.getGroup(groupId))
  const setSelectedGroup = useStore(s => s.setSelectedGroup)
  const clearSelectedGroup = useStore(s => s.clearSelectedGroup)
  const editGroupNameOverlay = useOverlay<Group>()
  const [showSegment, setShowSegment] = useState('members')

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
            <IconButton icon={pencilSharp} onClick={() => editGroupNameOverlay.onSelect(group)} />
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
          {/* key is needed for AnimatePresence to work correctly on 2 different components */}
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
              label: 'Gruppe teilen (PDF)',
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
              routerLink: `/groups/${groupId}/member`,
            },
            {
              label: 'Zahlung hinzufügen',
              description: 'Neue Zahlung zwischen den Personen',
              icon: walletSharp,
              routerLink: `/groups/${groupId}/compensation`,
              disabled: group.members.length < 2,
            },
            {
              label: 'Einkommen hinzufügen',
              description: 'Geld wurde eingenommen (z.B. Pfand)',
              icon: serverSharp,
              routerLink: `/groups/${groupId}/income`,
              disabled: group.members.length < 1,
            },
            {
              label: 'Einkauf hinzufügen',
              description: 'Geld wurde ausgegeben',
              icon: cartSharp,
              routerLink: `/groups/${groupId}/purchase`,
              disabled: group.members.length < 1,
            },
          ]}
        </FabButton>
        <AlertModal
          overlay={editGroupNameOverlay}
          component={EditGroupNameModal}
          componentProps={{ selected: editGroupNameOverlay.selected! }}
        />
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
