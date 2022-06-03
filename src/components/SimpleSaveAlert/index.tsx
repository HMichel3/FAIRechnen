import { IonAlert } from '@ionic/react'
import { isEmpty, trim } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useStore } from '../../stores/useStore'

interface SimpleSaveAlertProps {
  isOpen: boolean
  header: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onSave: (newValue: string) => void
  value?: string
  placeholder?: string
}

export const SimpleSaveAlert = ({
  isOpen,
  header,
  setIsOpen,
  onSave,
  value,
  placeholder = 'Name eingeben',
}: SimpleSaveAlertProps) => {
  const setShowAnimation = useStore(s => s.setShowAnimation)

  const onHandler = (newValue: string) => {
    if (isEmpty(newValue)) return false
    if (value === newValue) return true
    onSave(newValue)
    setShowAnimation()
  }

  return (
    <IonAlert
      cssClass='save-alert'
      isOpen={isOpen}
      onDidDismiss={() => setIsOpen(false)}
      header={header}
      inputs={[
        {
          name: 'newValue',
          ...(value && { value }),
          placeholder: placeholder,
        },
      ]}
      buttons={[
        { role: 'cancel', text: 'Abbrechen' },
        {
          text: 'Speichern',
          handler: ({ newValue }) => onHandler(trim(newValue)),
        },
      ]}
    />
  )
}
