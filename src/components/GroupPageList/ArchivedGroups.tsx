import { IonIcon, IonItem, IonItemOption, IonLabel } from '@ionic/react'
import { AnimatePresence, motion } from 'framer-motion'
import { archiveSharp, chevronDownSharp, chevronUpSharp } from 'ionicons/icons'
import { fadeInOutTopVariants, variantProps } from '../../App/animations'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { SlidingListItem } from '../SlidingListItem'

interface ArchivedGroupsProps {
  showGroupArchive: boolean
  setShowGroupArchive: React.Dispatch<React.SetStateAction<boolean>>
}

export const ArchivedGroups = ({ showGroupArchive, setShowGroupArchive }: ArchivedGroupsProps) => {
  const groupArchive = usePersistedStore(s => s.groupArchive)
  const restoreGroup = usePersistedStore(s => s.restoreGroup)
  const deleteArchivedGroup = usePersistedStore(s => s.deleteArchivedGroup)

  return (
    <>
      <IonItem onClick={() => setShowGroupArchive(prevState => !prevState)} lines='none'>
        <IonLabel>Archivierte Gruppen ({groupArchive.length})</IonLabel>
        <IonIcon slot='end' icon={showGroupArchive ? chevronUpSharp : chevronDownSharp} />
      </IonItem>
      <AnimatePresence mode='wait'>
        {showGroupArchive && (
          <motion.div variants={fadeInOutTopVariants} {...variantProps}>
            {groupArchive.map(group => (
              <SlidingListItem
                key={group.id}
                label={group.name}
                onDelete={() => deleteArchivedGroup(group.id)}
                icon={archiveSharp}
                detail={false}
                lines='none'
                rightSlideOption={
                  <IonItemOption onClick={() => restoreGroup(group.id)}>Wiederherstellen</IonItemOption>
                }
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
