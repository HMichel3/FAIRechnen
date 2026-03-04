import { IonContent, IonItem, IonPage, IonRadio, IonRadioGroup } from '@ionic/react'
import { AnimatePresence } from 'motion/react'
import { isNotEmpty } from 'ramda'
import { useRef, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { hasAtLeast } from 'remeda'
import { AddManualCompensation } from '../components/AddManualCompensition'
import { PaymentInfo } from '../components/info/PaymentInfo'
import { PageFooter } from '../components/ui/PageFooter'
import { PageHeader } from '../components/ui/PageHeader'
import { useDismiss } from '../hooks/useDissmiss'
import { usePersistedStore } from '../stores/usePersistedStore'
import { useStore } from '../stores/useStore'
import { CompensationWithoutTimestamp, NewCompensation } from '../types/common'
import { findItem, getCompensationInfo } from '../utils/common'
import { generateCompensationChain, generatePossibleCompensations } from '../utils/compensation'

type AddCompensationPageProps = RouteComponentProps<{
  id: string
}>

export const AddCompensationPage = ({
  match: {
    params: { id: groupId },
  },
}: AddCompensationPageProps) => {
  const addCompensation = usePersistedStore(s => s.addCompensation)
  const addCompensations = usePersistedStore(s => s.addCompensations)
  const { membersWithAmounts, members } = useStore(s => s.selectedGroup)
  const showAnimation = useStore(s => s.showAnimation)
  const [manualCompensation, setManualCompensation] = useState<NewCompensation | null>(null)
  const pageContentRef = useRef<HTMLIonContentElement>(null)
  const { current: possibleCompensations } = useRef(generatePossibleCompensations(membersWithAmounts))
  const [checkedRadio, setCheckedRadio] = useState<string>(isNotEmpty(possibleCompensations) ? 'all' : 'manual')
  const onDismiss = useDismiss(`/groups/${groupId}`)

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
    addCompensation(groupId, newCompensation)
    showAnimation()
    onDismiss()
  }

  const onAllCompensations = () => {
    const newCompensations = generateCompensationChain(membersWithAmounts)
    addCompensations(groupId, newCompensations)
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
            const { payer, receiver } = getCompensationInfo(compensation, members)
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
          {checkedRadio === 'manual' && <AddManualCompensation setManualCompensation={setManualCompensation} />}
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
