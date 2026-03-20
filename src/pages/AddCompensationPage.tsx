import { IonContent, IonItem, IonPage, IonRadio, IonRadioGroup } from '@ionic/react'
import { AnimatePresence } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { hasAtLeast } from 'remeda'
import { PaymentInfo } from '../components/info/PaymentInfo'
import { AddManualCompensation } from '../components/others/AddManualCompensition'
import { PageFooter } from '../components/ui/PageFooter'
import { PageHeader } from '../components/ui/PageHeader'
import { useDismiss } from '../hooks/useDissmiss'
import { useGroupData } from '../hooks/useGroupData'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { CompensationWithoutTimestamp, NewCompensation } from '../types/common'
import { findItem, getCompensationInfo } from '../utils/common'
import { generateCompensationChain, generatePossibleCompensations } from '../utils/compensation'

export const AddCompensationPage = () => {
  const groupData = useGroupData()
  const addCompensation = usePersistedStore(s => s.addCompensation)
  const addCompensations = usePersistedStore(s => s.addCompensations)
  const showAnimation = useStore(s => s.showAnimation)
  const [manualCompensation, setManualCompensation] = useState<NewCompensation | null>(null)
  const pageContentRef = useRef<HTMLIonContentElement>(null)
  const possibleCompensations = useMemo(
    () => generatePossibleCompensations(groupData.membersWithAmounts),
    [groupData.membersWithAmounts]
  )
  const [checkedRadio, setCheckedRadio] = useState<string>(() =>
    hasAtLeast(possibleCompensations, 1) ? 'all' : 'manual'
  )
  const onDismiss = useDismiss(`/groups/${groupData.id}`)

  const onCheckRadio = (value: string) => {
    setCheckedRadio(value)
    if (value === 'manual') {
      setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
    }
  }

  const onAddCompensation = () => {
    let newCompensation: NewCompensation | CompensationWithoutTimestamp
    if (checkedRadio === 'manual') {
      newCompensation = manualCompensation!
    } else {
      newCompensation = findItem(checkedRadio, possibleCompensations)!
    }
    addCompensation(groupData.id, newCompensation)
    showAnimation()
    onDismiss()
  }

  const onAllCompensations = () => {
    const newCompensations = generateCompensationChain(groupData.membersWithAmounts)
    addCompensations(groupData.id, newCompensations)
    showAnimation()
    onDismiss()
  }

  return (
    <IonPage>
      <PageHeader title='Neue Zahlung' onDismiss={onDismiss} />
      <IonContent ref={pageContentRef}>
        <IonRadioGroup value={checkedRadio} onIonChange={({ detail }) => onCheckRadio(detail.value)}>
          {hasAtLeast(possibleCompensations, 1) && (
            <IonItem lines='full'>
              <IonRadio value='all' labelPlacement='end' justify='start'>
                Alles ausgleichen
              </IonRadio>
            </IonItem>
          )}
          {possibleCompensations.map(compensation => {
            const { payer, receiver } = getCompensationInfo(compensation, groupData.members)
            return (
              <IonItem key={compensation.id} lines='full'>
                <IonRadio value={compensation.id} labelPlacement='end' justify='start'>
                  <PaymentInfo {...compensation} name={payer!.name} subtitle={`An ${receiver?.name}`} />
                </IonRadio>
              </IonItem>
            )
          })}
          <IonItem lines='none'>
            <IonRadio value='manual' labelPlacement='end' justify='start'>
              Manuelle Zahlung
            </IonRadio>
          </IonItem>
        </IonRadioGroup>
        <AnimatePresence mode='wait'>
          {checkedRadio === 'manual' && (
            <AddManualCompensation members={groupData.members} setManualCompensation={setManualCompensation} />
          )}
        </AnimatePresence>
      </IonContent>
      <PageFooter
        disabled={checkedRadio === 'manual' && !manualCompensation}
        onClick={checkedRadio === 'all' ? onAllCompensations : onAddCompensation}
      >
        Zahlung speichern
      </PageFooter>
    </IonPage>
  )
}
