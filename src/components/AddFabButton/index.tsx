import { IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react'
import clsx from 'clsx'
import { addSharp } from 'ionicons/icons'
import { map } from 'ramda'
import './index.css'

interface AddFabButtonProps {
  showFab: boolean
  onClickFabButton: () => void
  onClickFabButtonInList: (onClick: () => void) => void
  onClickBackdrop: () => void
  children: { text: string; icon: string; onClick: () => void; disabled?: boolean }[]
}

export const AddFabButton = ({
  showFab,
  onClickFabButton,
  onClickFabButtonInList,
  onClickBackdrop,
  children,
}: AddFabButtonProps): JSX.Element => (
  <>
    <IonFab activated={showFab} vertical='bottom' horizontal='end' slot='fixed'>
      <IonFabButton color='medium' onClick={onClickFabButton}>
        <IonIcon icon={addSharp} />
      </IonFabButton>
      <IonFabList side='top'>
        {map(
          ({ text, icon, onClick, disabled }) => (
            <IonFabButton
              // needed, because disabled not working as expected
              className={clsx({ 'custom-button-disabled': disabled })}
              style={{ height: 56, width: 56 }}
              key={text}
              color='medium'
              data-label={text}
              // needed, because disabled not working as expected
              onClick={() => (disabled ? onClickBackdrop() : onClickFabButtonInList(onClick))}
            >
              <IonIcon icon={icon} />
            </IonFabButton>
          ),
          children
        )}
      </IonFabList>
    </IonFab>
  </>
)
