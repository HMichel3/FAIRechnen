import { IonSelectOption } from '@ionic/react'
import { map } from 'ramda'

export interface SelectOption {
  id: string
  name: string
}

interface SelectOptionsProps {
  selectOptions: SelectOption[]
}

export const SelectOptions = ({ selectOptions }: SelectOptionsProps): JSX.Element => (
  <>
    {map(
      selectOption => (
        <IonSelectOption key={selectOption.id} value={selectOption.id}>
          {selectOption.name}
        </IonSelectOption>
      ),
      selectOptions
    )}
  </>
)
