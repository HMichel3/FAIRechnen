import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonReorder,
  IonText,
} from '@ionic/react'
import { repeatSharp } from 'ionicons/icons'
import { MouseEventHandler } from 'react'
import { cn } from '../../App/utils'
import { Show } from '../SolidComponents/Show'

type SlidingListItemProps = {
  label?: string
  labelComponent?: JSX.Element
  onDelete?: MouseEventHandler<HTMLIonItemOptionElement>
  routerLink?: string
  endText?: string | JSX.Element
  onSelect?: MouseEventHandler<HTMLIonItemElement>
  icon?: string
  detail?: boolean
  reorder?: boolean
  lines?: 'inset' | 'full' | 'none'
  rightSlideOption?: JSX.Element
  activeIcon?: boolean
}

export const SlidingListItem = ({
  label,
  labelComponent,
  onDelete,
  routerLink,
  endText,
  onSelect,
  icon,
  detail,
  reorder = false,
  lines = 'inset',
  rightSlideOption,
  activeIcon = false,
}: SlidingListItemProps): JSX.Element => (
  <IonItemSliding>
    <Show when={onDelete}>
      <IonItemOptions side='start'>
        <IonItemOption color='danger' onClick={onDelete}>
          Löschen
        </IonItemOption>
      </IonItemOptions>
    </Show>
    <IonItem lines={lines} {...(!reorder && { routerLink, onClick: onSelect, detail })}>
      {reorder ? (
        <IonReorder slot='start' className='my-3 mr-8'>
          <IonIcon className='text-2xl' icon={repeatSharp} />
        </IonReorder>
      ) : (
        icon && <IonIcon color={cn({ primary: activeIcon })} icon={icon} slot='start' />
      )}
      <IonLabel>
        <Show when={label}>
          <IonLabel className='mb-1 truncate'>{label}</IonLabel>
        </Show>
        {labelComponent}
      </IonLabel>
      <Show when={endText}>
        <IonText slot='end'>{endText}</IonText>
      </Show>
    </IonItem>
    <Show when={rightSlideOption}>
      <IonItemOptions side='end'>{rightSlideOption}</IonItemOptions>
    </Show>
  </IonItemSliding>
)
