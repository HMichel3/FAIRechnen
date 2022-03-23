import { App } from '@capacitor/app'
import { useIonRouter } from '@ionic/react'
import { useEffect, useRef, useState } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { isDark } from './utils'

export const useGroupPage = () => {
  const theme = usePersistedStore.useTheme()
  const alreadyVisited = usePersistedStore.useAlreadyVisited()
  const setAlreadyVisited = usePersistedStore.useSetAlreadyVisited()
  const ionRouter = useIonRouter()
  const [showInfoSlides, setShowInfoSlides] = useState(false)
  const [showDeleteGroupAlert, setShowDeleteGroupAlert] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [showFirstInfoSlides, setShowFirstInfoSlides] = useState(!alreadyVisited)
  // needed to remove the ion-page-invisible to show the page after the firstInfoSlide is closed
  const pageRef = useRef(null)

  useEffect(() => {
    document.addEventListener('ionBackButton', event => {
      // @ts-ignore
      event.detail.register(-1, () => {
        if (showInfoSlides) return setShowInfoSlides(false)
        if (showFirstInfoSlides) return onHideFirstInfoSlides()
        if (!ionRouter.canGoBack()) App.exitApp()
      })
    })
  }, [ionRouter, showInfoSlides, showFirstInfoSlides])

  useEffect(() => {
    if (isDark(theme)) return document.body.classList.add('dark')
    document.body.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    setAlreadyVisited()
  }, [setAlreadyVisited])

  const onDeleteGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
    setShowDeleteGroupAlert(true)
  }

  const onHideFirstInfoSlides = () => {
    setShowFirstInfoSlides(false)
    // @ts-ignore typing on pageRef is not correct from ionic
    pageRef.current?.classList.remove('ion-page-invisible')
  }

  return {
    theme,
    showInfoSlides,
    showDeleteGroupAlert,
    selectedGroupId,
    setShowDeleteGroupAlert,
    onDeleteGroup,
    setShowInfoSlides,
    showFirstInfoSlides,
    onHideFirstInfoSlides,
    pageRef,
  }
}
