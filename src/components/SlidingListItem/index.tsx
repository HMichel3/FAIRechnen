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

interface SlidingListItemProps {
  label?: string
  labelComponent?: JSX.Element
  onDelete: MouseEventHandler<HTMLIonItemOptionElement>
  routerLink?: string
  endText?: string | JSX.Element
  onSelect?: MouseEventHandler<HTMLIonItemElement>
  icon?: string
  style?: { [key: string]: number | string }
  detail?: boolean
  reorder?: boolean
  transparentLine?: boolean
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
}: SlidingListItemProps): JSX.Element => (
  <IonItemSliding style={style}>
    <IonItemOptions side='start'>
      <IonItemOption className='sliding-delete' color='danger' onClick={onDelete}>
        Löschen
      </IonItemOption>
    </IonItemOptions>
    <IonItem
      className={clsx('detail-icon-opacity-0-5 item-border-color', { 'transparent-line': transparentLine })}
      button
      detail={detail && isNil(endText)}
      routerLink={routerLink}
      onClick={!routerLink ? onSelect : undefined}
      lines='inset'
    >
      {reorder ? (
        <IonReorder slot='start'>
          <IonIcon style={{ width: 24, height: 24 }} className='list-item-icon-color' icon={repeatSharp} />
        </IonReorder>
      ) : (
        icon && <IonIcon className='list-item-icon-color' icon={icon} slot='start' />
      )}
      <IonLabel>
        {label && <IonLabel>{label}</IonLabel>}
        {labelComponent}
      </IonLabel>
      {endText && (
        <IonText className='ion-text-end' slot='end'>
          {endText}
        </IonText>
      )}
    </IonItem>
  </IonItemSliding>
)
