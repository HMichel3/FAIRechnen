import { IonFab, IonFabButton, IonFabList, IonIcon, IonText } from '@ionic/react'
import { equals } from 'ramda'
import { ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../App/utils'
import { Show } from '../SolidComponents/Show'
import { useFabButton } from './useFabButton'

type FabButtonTextProps = FabButtonProps['children'][number] & {
  horizontal: FabButtonProps['horizontal']
  onClickFabButtonInList: (onClick: () => void) => void
}

const FabButtonText = ({
  horizontal,
  onClickFabButtonInList,
  label,
  description,
  icon,
  onClick,
  disabled,
}: FabButtonTextProps): JSX.Element => {
  if (equals(horizontal, 'start')) {
    return (
      <div className='flex gap-3'>
        <IonFabButton color='primary' onClick={() => onClickFabButtonInList(onClick)} disabled={disabled}>
          <IonIcon icon={icon} />
        </IonFabButton>
        <div className='mr-[-204px] mt-[-5px] flex w-48 flex-col items-start justify-center'>
          <IonText className={cn({ 'text-neutral-400': disabled })}>{label}</IonText>
          <IonText className='whitespace-nowrap text-sm text-neutral-400'>{description}</IonText>
        </div>
      </div>
    )
  }
  return (
    <div className='flex gap-3'>
      <div className='ml-[-204px] mt-[-5px] flex w-48 flex-col items-end justify-center'>
        <IonText className={cn({ 'text-neutral-400': disabled })}>{label}</IonText>
        <IonText className='whitespace-nowrap text-sm text-neutral-400'>{description}</IonText>
      </div>
      <IonFabButton color='primary' onClick={() => onClickFabButtonInList(onClick)} disabled={disabled}>
        <IonIcon icon={icon} />
      </IonFabButton>
    </div>
  )
}

type FabButtonProps = Omit<ComponentProps<typeof IonFab>, 'activated' | 'children'> & {
  icon: string
  children: { label: string; description: string; icon: string; onClick: () => void; disabled?: boolean }[]
}

export const FabButton = ({ icon, children, horizontal, ...props }: FabButtonProps): JSX.Element => {
  const { activated, showBackdrop, onClickFabButton, onClickFabButtonInList, onClickBackdrop } = useFabButton()

  const component = (
    <>
      <IonFab activated={activated} horizontal={horizontal} {...props}>
        <IonFabButton onClick={onClickFabButton}>
          <IonIcon icon={icon} />
        </IonFabButton>
        <IonFabList side='top' className='gap-3'>
          {children.map(({ label, ...rest }) => (
            <FabButtonText
              key={label}
              horizontal={horizontal}
              onClickFabButtonInList={onClickFabButtonInList}
              label={label}
              {...rest}
            />
          ))}
        </IonFabList>
      </IonFab>
      <Show when={showBackdrop}>
        <div className='absolute inset-0 bg-black/60' onClick={onClickBackdrop} />
      </Show>
    </>
  )

  if (activated) {
    return createPortal(component, document.body)
  }

  return component
}
