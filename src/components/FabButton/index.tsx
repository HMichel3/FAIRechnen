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
  const Button = (
    <IonFabButton color='primary' onClick={() => onClickFabButtonInList(onClick)} disabled={disabled}>
      <IonIcon icon={icon} />
    </IonFabButton>
  )

  const className = cn(
    'flex flex-col justify-center text-nowrap bg-[var(--ion-item-background)]',
    disabled && 'opacity-50',
    equals(horizontal, 'start')
      ? 'ml-[-40px] w-[292px] items-start rounded-e-3xl pl-10 pr-4'
      : 'ml-[-263px] mr-[-40px] w-[290px] items-end rounded-s-3xl pl-4 pr-10'
  )

  return (
    <div className='flex gap-3'>
      {equals(horizontal, 'start') && Button}
      <div className={className}>
        <IonText>{label}</IonText>
        <IonText className='text-sm text-neutral-400'>{description}</IonText>
      </div>
      {equals(horizontal, 'end') && Button}
    </div>
  )
}

type FabButtonProps = Omit<
  ComponentProps<typeof IonFab>,
  'activated' | 'children' | 'horizontal' | 'vertical' | 'slot'
> & {
  icon: string
  children: { label: string; description: string; icon: string; onClick: () => void; disabled?: boolean }[]
  horizontal: 'start' | 'end'
}

export const FabButton = ({ icon, children, horizontal, ...props }: FabButtonProps): JSX.Element => {
  const { activated, showBackdrop, onClickFabButton, onClickFabButtonInList, onClickBackdrop } = useFabButton()

  const component = (
    <>
      <IonFab activated={activated} horizontal={horizontal} vertical='bottom' slot='fixed' {...props}>
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
      {/* IonBackdrop is not working properly */}
      <Show when={showBackdrop}>
        <div className='backdrop absolute inset-0' onClick={onClickBackdrop} />
      </Show>
    </>
  )

  if (activated) {
    return createPortal(component, document.body)
  }

  return component
}
