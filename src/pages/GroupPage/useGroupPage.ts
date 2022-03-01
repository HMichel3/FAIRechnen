import { App } from '@capacitor/app'
import { useIonRouter } from '@ionic/react'
import { useEffect, useState } from 'react'
import { Group } from '../../App/types'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { isDark } from './utils'

export const useGroupPage = () => {
  const theme = usePersistedStore.useTheme()
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
    if (isDark(theme)) return document.body.classList.add('dark')
    document.body.classList.remove('dark')
  }, [theme])

  const onDeleteGroup = (groupId: Group['groupId']) => {
    setSelectedGroupId(groupId)
    setShowDeleteGroupAlert(true)
  }

  const onToggleShowInfoSlides = () => {
    setShowInfoSlides(prevState => !prevState)
  }

  return {
    theme,
    showInfoSlides,
    showDeleteGroupAlert,
    selectedGroupId,
    setShowDeleteGroupAlert,
    onDeleteGroup,
    onToggleShowInfoSlides,
  }
}
