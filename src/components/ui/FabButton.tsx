import { IonFab, IonFabButton, IonFabList, IonIcon, IonText } from '@ionic/react'
import { ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import { useFabButton } from '../../hooks/useFabButton'
import { cn } from '../../utils/common'

type FabButtonTextProps = ChildBase & {
  horizontal: FabButtonProps['horizontal']
  onClick?: () => void
  routerLink?: string
}

const FabButtonText = ({ horizontal, label, description, icon, disabled, onClick, routerLink }: FabButtonTextProps) => {
  const Button = (
    <IonFabButton color='primary' routerLink={routerLink} onClick={onClick} disabled={disabled}>
      <IonIcon icon={icon} />
    </IonFabButton>
  )

  const className = cn(
    'flex flex-col justify-center text-nowrap bg-[var(--ion-item-background)]',
    disabled && 'opacity-50',
    horizontal === 'start'
      ? 'ml-[-40px] w-[292px] items-start rounded-e-3xl pl-10 pr-4'
      : 'ml-[-263px] mr-[-40px] w-[290px] items-end rounded-s-3xl pl-4 pr-10'
  )

  return (
    <div className='flex gap-3'>
      {horizontal === 'start' && Button}
      <div className={className}>
        <IonText>{label}</IonText>
        <IonText className='text-sm text-neutral-400'>{description}</IonText>
      </div>
      {horizontal === 'end' && Button}
    </div>
  )
}

type ChildBase = { label: string; description: string; icon: string; disabled?: boolean }

type Child = ChildBase & ({ onClick: () => void; routerLink?: never } | { routerLink: string; onClick?: never })

type FabButtonProps = Omit<
  ComponentProps<typeof IonFab>,
  'activated' | 'children' | 'horizontal' | 'vertical' | 'slot'
> & {
  icon: string
  children: Child[]
  horizontal: 'start' | 'end'
}

export const FabButton = ({ icon, children, horizontal, ...props }: FabButtonProps) => {
  const { activated, onClickFabButton, onClickFabButtonInList, onClickBackdrop } = useFabButton()

  const component = (
    <>
      <IonFab activated={activated} horizontal={horizontal} vertical='bottom' slot='fixed' {...props}>
        <IonFabButton onClick={onClickFabButton}>
          <IonIcon icon={icon} />
        </IonFabButton>
        <IonFabList side='top' className='gap-3'>
          {children.map(({ label, onClick, ...rest }) => (
            <FabButtonText
              key={label}
              horizontal={horizontal}
              label={label}
              onClick={() => onClickFabButtonInList(onClick)}
              {...rest}
            />
          ))}
        </IonFabList>
      </IonFab>
      {/* IonBackdrop is not working properly */}
      {activated && <div className='backdrop' onClick={onClickBackdrop} />}
    </>
  )

  if (activated) {
    return createPortal(component, document.body)
  }

  return component
}
