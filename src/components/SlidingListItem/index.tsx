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
import { isNil, isNotNil } from 'ramda'
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
  detail = true,
  reorder = false,
  lines = 'inset',
  rightSlideOption,
  activeIcon = false,
}: SlidingListItemProps): JSX.Element => (
  <IonItemSliding>
    <Show when={isNotNil(onDelete)}>
      <IonItemOptions side='start'>
        <IonItemOption color='danger' onClick={onDelete}>
          Löschen
        </IonItemOption>
      </IonItemOptions>
    </Show>
    <IonItem button detail={detail && isNil(endText)} routerLink={routerLink} onClick={onSelect} lines={lines}>
      {reorder ? (
        <IonReorder slot='start'>
          <IonIcon icon={repeatSharp} />
        </IonReorder>
      ) : (
        icon && <IonIcon color={cn({ primary: activeIcon })} icon={icon} slot='start' />
      )}
      <IonLabel>
        <Show when={isNotNil(label)}>
          <IonLabel className='mb-1'>{label}</IonLabel>
        </Show>
        {labelComponent}
      </IonLabel>
      <Show when={isNotNil(endText)}>
        <IonText slot='end'>{endText}</IonText>
      </Show>
    </IonItem>
    <Show when={isNotNil(rightSlideOption)}>
      <IonItemOptions side='end'>{rightSlideOption}</IonItemOptions>
    </Show>
  </IonItemSliding>
)
