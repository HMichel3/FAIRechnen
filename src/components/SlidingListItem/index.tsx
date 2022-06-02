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
import clsx from 'clsx'
import { repeatSharp } from 'ionicons/icons'
import { isNil } from 'ramda'
import { MouseEventHandler } from 'react'
import { Show } from '../SolidComponents/Show'

interface SlidingListItemProps {
  label?: string
  labelComponent?: JSX.Element
  onDelete?: MouseEventHandler<HTMLIonItemOptionElement>
  routerLink?: string
  endText?: string | JSX.Element
  onSelect?: MouseEventHandler<HTMLIonItemElement>
  icon?: string
  style?: { [key: string]: number | string }
  detail?: boolean
  reorder?: boolean
  transparentLine?: boolean
  lines?: 'inset' | 'full' | 'none'
  rightSlideOption?: JSX.Element
  className?: string
  iconClassName?: string
}

export const SlidingListItem = ({
  label,
  labelComponent,
  onDelete,
  routerLink,
  endText,
  onSelect,
  icon,
  style,
  detail = true,
  reorder = false,
  transparentLine = false,
  lines = 'inset',
  rightSlideOption,
  className,
  iconClassName,
}: SlidingListItemProps): JSX.Element => (
  <IonItemSliding style={style}>
    <Show when={!isNil(onDelete)}>
      <IonItemOptions side='start'>
        <IonItemOption className='sliding-delete' color='danger' onClick={onDelete}>
          Löschen
        </IonItemOption>
      </IonItemOptions>
    </Show>
    <IonItem
      className={clsx('detail-icon-opacity-0-5 item-border-color', { 'transparent-line': transparentLine }, className)}
      button
      detail={detail && isNil(endText)}
      routerLink={routerLink}
      onClick={onSelect}
      lines={lines}
    >
      {reorder ? (
        <IonReorder slot='start'>
          <IonIcon
            style={{ width: 24, height: 24 }}
            className={clsx('list-item-icon-color', iconClassName)}
            icon={repeatSharp}
          />
        </IonReorder>
      ) : (
        icon && <IonIcon className={clsx('list-item-icon-color', iconClassName)} icon={icon} slot='start' />
      )}
      <IonLabel className={clsx({ 'default-margin-right': detail && isNil(endText) })}>
        <Show when={!isNil(label)}>
          <IonLabel>{label}</IonLabel>
        </Show>
        {labelComponent}
      </IonLabel>
      <Show when={!isNil(endText)}>
        <IonText className='ion-text-end' slot='end'>
          {endText}
        </IonText>
      </Show>
    </IonItem>
    <Show when={!isNil(rightSlideOption)}>
      <IonItemOptions side='end'>{rightSlideOption}</IonItemOptions>
    </Show>
  </IonItemSliding>
)
