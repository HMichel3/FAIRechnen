import { App } from '@capacitor/app'
import { useIonRouter } from '@ionic/react'
import { useEffect, useRef, useState } from 'react'
import { usePersistedStore } from '../../stores/usePersistedStore'
import { isDark } from './utils'

export const useGroupPage = () => {
  const theme = usePersistedStore(s => s.theme)
  const alreadyVisited = usePersistedStore(s => s.alreadyVisited)
  const setAlreadyVisited = usePersistedStore(s => s.setAlreadyVisited)
  const ionRouter = useIonRouter()
  const [showInfoSlides, setShowInfoSlides] = useState(false)
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

  const onHideFirstInfoSlides = () => {
    setShowFirstInfoSlides(false)
    // @ts-ignore typing on pageRef is not correct from ionic
    pageRef.current?.classList.remove('ion-page-invisible')
  }

  return { theme, showInfoSlides, setShowInfoSlides, showFirstInfoSlides, onHideFirstInfoSlides, pageRef }
}
