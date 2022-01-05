import { App } from '@capacitor/app'
import { useIonRouter, useIonModal } from '@ionic/react'
import { useEffect, useState } from 'react'
import { Group } from '../../App/types'
import { getTotalAmountFromArray } from '../../App/utils'
import { AddGroupModal } from '../../components/AddGroupModal'
import { useToggle } from '../../hooks/useToggle'
import { usePersistedStore } from '../../stores/usePersistedStore'

export const useGroupPage = () => {
  const groups = usePersistedStore.useGroups()
  const deleteGroup = usePersistedStore.useDeleteGroup()
  const setGroups = usePersistedStore.useSetGroups()
  const getGroupPurchases = usePersistedStore.useGetGroupPurchases()
  const theme = usePersistedStore.useTheme()
  const setTheme = usePersistedStore.useSetTheme()
  const firstTime = usePersistedStore.useFirstTime()
  const setFirstTimeFalse = usePersistedStore.useSetFirstTimeFalse()
  const ionRouter = useIonRouter()
  const [showAddGroupModal, dismissAddGroupModal] = useIonModal(AddGroupModal, {
    onDismiss: () => dismissAddGroupModal(),
  })
  const [showInfoSlides, setShowInfoSlides] = useState(false)
  const [showDeleteGroupAlert, setShowDeleteGroupAlert] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState('')

  useEffect(() => {
    document.addEventListener('ionBackButton', event => {
      // @ts-ignore
      event.detail.register(-1, () => {
        if (showInfoSlides) {
          setShowInfoSlides(false)
          return
        }

        if (!ionRouter.canGoBack()) {
          App.exitApp()
        }
      })
    })
  }, [ionRouter, showInfoSlides, setShowInfoSlides])

  useEffect(() => {
    if (!theme) {
      document.body.classList.remove('dark')
      return
    }
    document.body.classList.add('dark')
  }, [theme])

  // can't use firstTime as defaultValue for showInfoSlides, because it's true for a ms at every refresh
  useEffect(() => {
    setShowInfoSlides(firstTime)
  }, [firstTime, setShowInfoSlides])

  const onDeleteGroup = (groupId: Group['id']) => {
    setSelectedGroupId(groupId)
    setShowDeleteGroupAlert(true)
  }

  const onToggleDarkMode = () => {
    if (!theme) {
      setTheme('dark')
      return
    }
    setTheme(null)
  }

  const onToggleShowInfoSlides = () => {
    setShowInfoSlides(prevState => !prevState)
    firstTime && setFirstTimeFalse()
  }

  const calculateGroupTotalAmount = (groupId: Group['id']) => getTotalAmountFromArray(getGroupPurchases(groupId))

  return {
    groups,
    showInfoSlides,
    showDeleteGroupAlert,
    selectedGroupId,
    showAddGroupModal,
    deleteGroup,
    setShowDeleteGroupAlert,
    onDeleteGroup,
    onToggleDarkMode,
    onToggleShowInfoSlides,
    calculateGroupTotalAmount,
    setGroups,
  }
}
