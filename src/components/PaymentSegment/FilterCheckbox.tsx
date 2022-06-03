import { IonCheckbox, IonItem, IonLabel } from '@ionic/react'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'
import { isDark } from '../../pages/GroupPage/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'

interface FilterCheckboxProps {
  label: string
  checked: boolean
  setChecked: Dispatch<SetStateAction<boolean>>
}

export const FilterCheckbox = ({ label, checked, setChecked }: FilterCheckboxProps) => {
  const theme = usePersistedStore(s => s.theme)

  return (
    <IonItem className='ion-no-padding' lines='none'>
      <IonCheckbox
        className='checkbox-input'
        color={clsx({ light: isDark(theme) })}
        checked={checked}
        onIonChange={e => setChecked(e.detail.checked)}
      />
      <IonLabel color={clsx({ light: isDark(theme) })}>{label}</IonLabel>
    </IonItem>
  )
}
