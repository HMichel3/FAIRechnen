import { IonButton, IonIcon } from '@ionic/react'
import { ComponentProps } from 'react'
import { cn } from '../../utils/common'

type IconButtonProps = ComponentProps<typeof IonButton> & {
  icon: string
}

export const IconButton = ({
  icon,
  children,
  className,
  type,
  expand = 'block',
  fill = 'clear',
  ...props
}: IconButtonProps) => {
  const buttonType = props.form ? 'submit' : (type ?? 'button')

  if (!children) {
    return (
      <IonButton className={cn('m-0', className)} fill={fill} type={buttonType} {...props}>
        <IonIcon slot='icon-only' icon={icon} />
      </IonButton>
    )
  }

  return (
    <IonButton className={cn('m-0', className)} expand={expand} fill={fill} type={buttonType} {...props}>
      {children}
      <IonIcon slot='end' icon={icon} />
    </IonButton>
  )
}
