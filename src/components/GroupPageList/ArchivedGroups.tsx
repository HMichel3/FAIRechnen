import { IonIcon, IonItem, IonItemOption, IonLabel } from '@ionic/react'
import { AnimatePresence, motion } from 'framer-motion'
import { archiveSharp, chevronDownSharp, chevronUpSharp } from 'ionicons/icons'
import { fadeInOutTopVariants, variantProps } from '../../App/animations'
import { isLast } from '../../App/utils'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { SlidingListItem } from '../SlidingListItem'

interface ArchivedGroupsProps {
  showGroupArchive: boolean
  setShowGroupArchive: React.Dispatch<React.SetStateAction<boolean>>
}

export const ArchivedGroups = ({ showGroupArchive, setShowGroupArchive }: ArchivedGroupsProps) => {
  const groupArchive = usePersistedStore.useGroupArchive()
  const restoreGroup = usePersistedStore.useRestoreGroup()

  return (
    <>
      <IonItem onClick={() => setShowGroupArchive(prevState => !prevState)} lines='none'>
        <IonLabel>Archivierte Gruppen ({groupArchive.length})</IonLabel>
        <IonIcon color='light' slot='end' icon={showGroupArchive ? chevronUpSharp : chevronDownSharp} />
      </IonItem>
      <AnimatePresence exitBeforeEnter>
        {showGroupArchive && (
          <motion.div variants={fadeInOutTopVariants} {...variantProps}>
            {groupArchive.map(group => (
              <SlidingListItem
                key={group.id}
                label={group.name}
                icon={archiveSharp}
                transparentLine={isLast(group, groupArchive)}
                detail={false}
                lines='none'
                rightSlideOption={
                  <IonItemOption className='sliding-restore' color='success' onClick={() => restoreGroup(group.id)}>
                    Wiederherstellen
                  </IonItemOption>
                }
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
