import { App } from '@capacitor/app'
import { useIonRouter } from '@ionic/react'
import { useEffect, useState } from 'react'
import { Group } from '../../App/types'
import { usePersistedStore } from '../../stores/usePersistedStore'

export const useGroupPage = () => {
  const theme = usePersistedStore.useTheme()
  const setTheme = usePersistedStore.useSetTheme()
  const ionRouter = useIonRouter()
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

  const onDeleteGroup = (groupId: Group['groupId']) => {
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

  return {
    showInfoSlides,
    showDeleteGroupAlert,
    selectedGroupId,
    setShowDeleteGroupAlert,
    onDeleteGroup,
    onToggleDarkMode,
    onToggleShowInfoSlides,
  }
}
