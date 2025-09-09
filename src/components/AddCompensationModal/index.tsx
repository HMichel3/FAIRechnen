import { IonContent, IonFooter, IonItem, IonRadio, IonRadioGroup, IonToolbar } from '@ionic/react'
import { saveSharp } from 'ionicons/icons'
import { AnimatePresence } from 'motion/react'
import { isNotEmpty } from 'ramda'
import { useRef, useState } from 'react'
import { NewCompensation } from '../../App/types'
import { findItem } from '../../App/utils'
import { generateCompensationChain } from '../../pages/GroupInfoPage/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { IconButton } from '../IconButton'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { Show } from '../SolidComponents/Show'
import { AddManualCompensation } from './AddManualCompensation'
import { CompensationItem } from './CompensationItem'
import { generatePossibleCompensations } from './utils'

type AddCompensationModalProps = {
  onDismiss: () => void
}

export const AddCompensationModal = ({ onDismiss }: AddCompensationModalProps): JSX.Element => {
  const addCompensation = usePersistedStore(s => s.addCompensation)
  const addCompensations = usePersistedStore(s => s.addCompensations)
  const { id: groupId, membersWithAmounts } = useStore(s => s.selectedGroup)
  const setShowAnimation = useStore(s => s.setShowAnimation)
  const [manualCompensation, setManualCompensation] = useState<NewCompensation | null>(null)
  const pageContentRef = useRef<HTMLIonContentElement>(null)
  const { current: possibleCompensations } = useRef(generatePossibleCompensations(membersWithAmounts))
  const [checkedRadio, setCheckedRadio] = useState<string>(isNotEmpty(possibleCompensations) ? 'all' : 'manual')

  const onCheckRadio = (value: string) => {
    setCheckedRadio(value)
    if (value === 'manual') {
      setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
    }
  }

  const onAddCompensation = () => {
    let newCompensation: NewCompensation
    if (checkedRadio === 'manual') {
      newCompensation = manualCompensation!
    } else {
      newCompensation = findItem(checkedRadio, possibleCompensations)
    }
    addCompensation(groupId, newCompensation)
    setShowAnimation()
    onDismiss()
  }

  const onAllCompensations = () => {
    const newCompensations = generateCompensationChain(membersWithAmounts)
    addCompensations(groupId, newCompensations)
    setShowAnimation()
    onDismiss()
  }

  return (
    <div className='flex flex-1 flex-col'>
      <ModalHeader title='Neue Zahlung' onDismiss={onDismiss} />
      <IonContent ref={pageContentRef}>
        <IonRadioGroup value={checkedRadio} onIonChange={({ detail }) => onCheckRadio(detail.value)}>
          <Show when={isNotEmpty(possibleCompensations)}>
            <IonItem>
              <IonRadio labelPlacement='end' justify='start' value='all'>
                Alles ausgleichen
              </IonRadio>
            </IonItem>
          </Show>
          {possibleCompensations.map(compensation => (
            <CompensationItem key={compensation.id} compensation={compensation} />
          ))}
          <IonItem>
            <IonRadio labelPlacement='end' justify='start' value='manual'>
              Manuelle Zahlung
            </IonRadio>
          </IonItem>
        </IonRadioGroup>
        <AnimatePresence mode='wait'>
          {checkedRadio === 'manual' && <AddManualCompensation setManualCompensation={setManualCompensation} />}
        </AnimatePresence>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IconButton
            icon={saveSharp}
            disabled={checkedRadio === 'manual' && !manualCompensation}
            onClick={checkedRadio === 'all' ? onAllCompensations : onAddCompensation}
          >
            Zahlung speichern
          </IconButton>
        </IonToolbar>
      </IonFooter>
    </div>
  )
}
