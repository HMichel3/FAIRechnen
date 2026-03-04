import { IonIcon, IonItem, IonLabel } from '@ionic/react'
import { archiveSharp, chevronDownSharp, chevronUpSharp } from 'ionicons/icons'
import { AnimatePresence, motion } from 'motion/react'
import { Group } from '../stores/types'
import { fadeInOutTopVariants } from '../utils/animation'
import { usePersistedStore } from './../stores/usePersistedStore'
import { SlidingListItem } from './ui/SlidingListItem'

type ArchivedGroupsProps = {
  groupArchive: Group[]
  showGroupArchive: boolean
  setShowGroupArchive: React.Dispatch<React.SetStateAction<boolean>>
}

export const ArchivedGroups = ({ groupArchive, showGroupArchive, setShowGroupArchive }: ArchivedGroupsProps) => {
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
          <motion.div {...fadeInOutTopVariants}>
            {groupArchive.map(group => (
              <SlidingListItem
                key={group.id}
                icon={archiveSharp}
                label={group.name}
                onClick={() => restoreGroup(group.id)}
                onDelete={() => deleteArchivedGroup(group.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
