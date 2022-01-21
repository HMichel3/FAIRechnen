import { App } from '@capacitor/app'
import { useIonRouter, useIonModal } from '@ionic/react'
import { useEffect, useState } from 'react'
import { Group } from '../../App/types'
import { getTotalAmountFromArray } from '../../App/utils'
import { AddGroupModal } from '../../components/AddGroupModal'
import { usePersistedStore } from '../../stores/usePersistedStore'

export const useGroupPage = () => {
  const groups = usePersistedStore.useGroups()
  const deleteGroup = usePersistedStore.useDeleteGroup()
  const setGroups = usePersistedStore.useSetGroups()
  const getGroupPurchases = usePersistedStore.useGetGroupPurchases()
  const getGroupIncomes = usePersistedStore.useGetGroupIncomes()
  const theme = usePersistedStore.useTheme()
  const setTheme = usePersistedStore.useSetTheme()
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
  }

  const calculateGroupTotalAmount = (groupId: Group['id']) =>
    getTotalAmountFromArray(getGroupPurchases(groupId)) - getTotalAmountFromArray(getGroupIncomes(groupId))

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
