import { IonCheckbox, IonItem, IonLabel } from '@ionic/react'
import { Dispatch, SetStateAction } from 'react'

interface FilterCheckboxProps {
  label: string
  checked: boolean
  setChecked: Dispatch<SetStateAction<boolean>>
}

export const FilterCheckbox = ({ label, checked, setChecked }: FilterCheckboxProps) => (
  <IonItem className='ion-no-padding' color='medium' lines='none'>
    <IonCheckbox
      className='checkbox-input'
      color='light'
      checked={checked}
      onIonChange={e => setChecked(e.detail.checked)}
    />
    <IonLabel color='light'>{label}</IonLabel>
  </IonItem>
)
