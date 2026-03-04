import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonReorder } from '@ionic/react'
import { repeatSharp } from 'ionicons/icons'
import { ReactNode } from 'react'
import { cn } from '../../utils/common'

type SlidingListItemProps = {
  icon: string
  label: string | ReactNode
  onDelete?: () => void
  onArchive?: () => void
  reorder?: boolean
  isActive?: boolean
  lines?: 'inset' | 'full' | 'none'
  detail?: boolean
} & ({ onClick: () => void; routerLink?: never } | { routerLink: string; onClick?: never })

export const SlidingListItem = ({
  icon,
  label,
  onClick,
  routerLink,
  onDelete,
  onArchive,
  reorder,
  isActive,
  lines = 'none',
  detail,
}: SlidingListItemProps) => {
  if (reorder) {
    return (
      <IonItem lines={lines}>
        <IonReorder slot='start' className='my-3 mr-8'>
          <IonIcon className='text-2xl' icon={repeatSharp} />
        </IonReorder>
        <IonLabel>{label}</IonLabel>
      </IonItem>
    )
  }

  return (
    <IonItemSliding>
      {(onDelete || onArchive) && (
        <IonItemOptions side='start'>
          {onDelete && (
            <IonItemOption color='danger' onClick={onDelete}>
              Löschen
            </IonItemOption>
          )}
          {onArchive && (
            <IonItemOption color='warning' onClick={onArchive}>
              Archivieren
            </IonItemOption>
          )}
        </IonItemOptions>
      )}
      <IonItem lines={lines} routerLink={routerLink} onClick={onClick} detail={detail}>
        <IonIcon color={cn({ primary: isActive })} icon={icon} slot='start' />
        <IonLabel>{label}</IonLabel>
      </IonItem>
    </IonItemSliding>
  )
}
