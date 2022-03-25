import { IonContent, IonFooter, IonItem, IonLabel, IonRadio, IonRadioGroup, IonToolbar } from '@ionic/react'
import { AnimatePresence } from 'framer-motion'
import { AddManualCompensation } from './AddManualCompensation'
import { CompensationItem } from './CompensationItem'
import { IconButton } from '../IconButton'
import clsx from 'clsx'
import { ModalHeader } from '../modalComponents/ModalHeader'
import { saveSharp } from 'ionicons/icons'
import { pick } from 'ramda'
import { useState, useRef } from 'react'
import { NewCompensation } from '../../App/types'
import { calculateMembersWithAmounts, findItem } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { useStore } from '../../stores/useStore'
import { generatePossibleCompensations } from './utils'

export interface AddCompensationModalProps {
  onDismiss: () => void
}

export const AddCompensationModal = ({ onDismiss }: AddCompensationModalProps): JSX.Element => {
  const theme = usePersistedStore.useTheme()
  const addCompensation = usePersistedStore.useAddCompensation()
  const { id: groupId, members, purchases, incomes, compensations } = useStore.useSelectedGroup()
  const showAnimationOnce = useStore.useSetShowAnimationOnce()
  const [manualCompensation, setManualCompensation] = useState<NewCompensation | null>(null)
  const pageContentRef = useRef<HTMLIonContentElement>(null)
  const membersWithAmounts = calculateMembersWithAmounts(members, purchases, incomes, compensations)
  const { current: possibleCompensations } = useRef(generatePossibleCompensations(membersWithAmounts))
  const [checkedRadio, setCheckedRadio] = useState<string>(possibleCompensations[0]?.id ?? 'manual')

  const onAddCompensation = () => {
    let newCompensation: NewCompensation
    if (checkedRadio === 'manual') {
      newCompensation = manualCompensation!
    } else {
      newCompensation = pick(['amount', 'payerId', 'receiverId'], findItem(checkedRadio, possibleCompensations))
    }
    addCompensation(groupId, newCompensation)
    showAnimationOnce()
    onDismiss()
  }

  const onCheckRadio = (value: string) => {
    setCheckedRadio(value)
    if (value === 'manual') {
      setTimeout(() => pageContentRef.current?.scrollToBottom(), 300)
    }
  }

  return (
    <div className='flex-column-full-height'>
      <ModalHeader title='Neue Zahlung' onDismiss={onDismiss} />
      <IonContent ref={pageContentRef}>
        <IonRadioGroup value={checkedRadio} onIonChange={({ detail }) => onCheckRadio(detail.value)}>
          {possibleCompensations.map(compensation => (
            <CompensationItem key={compensation.id} compensation={compensation} />
          ))}
          <IonItem lines='none'>
            <IonRadio color={clsx({ light: theme === 'dark' })} slot='start' value='manual' />
            <IonLabel>Manuelle Zahlung</IonLabel>
          </IonItem>
        </IonRadioGroup>
        <AnimatePresence exitBeforeEnter>
          {checkedRadio === 'manual' && <AddManualCompensation setManualCompensation={setManualCompensation} />}
        </AnimatePresence>
      </IonContent>
      <IonFooter>
        <IonToolbar color='dark'>
          <IconButton
            icon={saveSharp}
            disabled={checkedRadio === 'manual' && !manualCompensation}
            onClick={onAddCompensation}
          >
            Zahlung speichern
          </IconButton>
        </IonToolbar>
      </IonFooter>
    </div>
  )
}
