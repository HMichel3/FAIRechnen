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
import { useState } from 'react'
import { stringify } from 'superjson'
import { AlertModal } from '../components/modals/AlertModal'
import { EditGroupNameModal } from '../components/modals/EditGroupNameModal'
import { BillPdf } from '../components/pdf/BillPdf'
import { MemberSegment } from '../components/segments/MemberSegment'
import { PaymentSegment } from '../components/segments/PaymentSegment'
import { FabButton } from '../components/ui/FabButton'
import { IconButton } from '../components/ui/IconButton'
import { useGroupData } from '../hooks/useGroupData'
import { useOverlay } from '../hooks/useOverlay'
import { Group } from '../types/store'
import { cn, createFileName } from '../utils/common'
import { blobToBase64 } from '../utils/file'

export const GroupInfoPage = () => {
  const groupData = useGroupData()
  const editGroupNameOverlay = useOverlay<Group>()
  const [showSegment, setShowSegment] = useState('members')

  const onShareGroupOverview = async () => {
    const pdfBlob = await pdf(<BillPdf {...groupData} />).toBlob()
    const fileName = createFileName(groupData.name, 'pdf')
    const { uri: filePath } = await Filesystem.writeFile({
      path: fileName,
      data: await blobToBase64(pdfBlob),
      directory: Directory.Cache,
    })
    await Share.share({
      title: `FAIRechnen - ${groupData.name} (PDF)`,
      dialogTitle: `${groupData.name} teilen`,
      files: [filePath],
    })
  }

  const onShareGroupData = async () => {
    const fileName = createFileName(groupData.name, 'json')
    const { uri: filePath } = await Filesystem.writeFile({
      path: fileName,
      data: stringify(groupData.originalGroup),
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    })
    await Share.share({
      title: `FAIRechnen - ${groupData.name} (JSON)`,
      dialogTitle: `${groupData.name} teilen`,
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
          <IonTitle>{groupData.name}</IonTitle>
          <IonButtons slot='end'>
            <IconButton icon={pencilSharp} onClick={() => editGroupNameOverlay.onSelect(groupData)} />
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
                  {groupData.members.length}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value='payments' onClick={() => setShowSegment('payments')}>
              <IonLabel>
                <IonLabel>Historie</IonLabel>
                <IonBadge
                  className={cn('bg-transparent text-[#a5a5a5]', { 'text-[#428cff]': showSegment === 'payments' })}
                >
                  {groupData.paymentQuantity}
                </IonBadge>
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <AnimatePresence mode='wait'>
          {/* key is needed for AnimatePresence to work correctly on 2 different components */}
          {showSegment === 'members' && <MemberSegment key='members' groupData={groupData} />}
          {showSegment === 'payments' && <PaymentSegment key='payments' groupData={groupData} />}
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
              routerLink: `/groups/${groupData.id}/member`,
            },
            {
              label: 'Zahlung hinzufügen',
              description: 'Neue Zahlung zwischen den Personen',
              icon: walletSharp,
              routerLink: `/groups/${groupData.id}/compensation`,
              disabled: groupData.members.length < 2,
            },
            {
              label: 'Einkommen hinzufügen',
              description: 'Geld wurde eingenommen (z.B. Pfand)',
              icon: serverSharp,
              routerLink: `/groups/${groupData.id}/income`,
              disabled: groupData.members.length < 1,
            },
            {
              label: 'Einkauf hinzufügen',
              description: 'Geld wurde ausgegeben',
              icon: cartSharp,
              routerLink: `/groups/${groupData.id}/purchase`,
              disabled: groupData.members.length < 1,
            },
          ]}
        </FabButton>
        <AlertModal
          overlay={editGroupNameOverlay}
          component={EditGroupNameModal}
          componentProps={{ selected: editGroupNameOverlay.selected! }}
        />
        {/* can be used to preview the PDF in the browser for making easy adjustments */}
        {/* {renderPdf(<BillPdf {...groupData} />, true)} */}
      </IonContent>
    </IonPage>
  )
}
