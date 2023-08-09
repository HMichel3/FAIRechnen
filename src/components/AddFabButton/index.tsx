import { IonFab, IonFabButton, IonIcon, IonFabList, IonText } from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { cn } from '../../App/utils'

interface AddFabButtonProps {
  showFab: boolean
  onClickFabButton: () => void
  onClickFabButtonInList: (onClick: () => void) => void
  children: { label: string; description: string; icon: string; onClick: () => void; disabled?: boolean }[]
}

export const AddFabButton = ({
  showFab,
  onClickFabButton,
  onClickFabButtonInList,
  children,
}: AddFabButtonProps): JSX.Element => (
  <>
    <IonFab activated={showFab} vertical='bottom' horizontal='end' slot='fixed'>
      <IonFabButton onClick={onClickFabButton}>
        <IonIcon icon={addSharp} />
      </IonFabButton>
      <IonFabList side='top' className='gap-2'>
        {children.map(({ label, description, icon, onClick, disabled }) => (
          <div key={label} className='flex gap-2'>
            <div className='ml-[-200px] flex w-48 flex-col items-end justify-center'>
              <IonText className={cn({ 'text-neutral-400': disabled })}>{label}</IonText>
              <IonText className='whitespace-nowrap text-sm text-neutral-400'>{description}</IonText>
            </div>
            <IonFabButton onClick={() => onClickFabButtonInList(onClick)} disabled={disabled}>
              <IonIcon icon={icon} />
            </IonFabButton>
          </div>
        ))}
      </IonFabList>
    </IonFab>
  </>
)
