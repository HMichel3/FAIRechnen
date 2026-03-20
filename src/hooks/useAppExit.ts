import { App as CapacitorApp } from '@capacitor/app'
import { BackButtonEvent } from '@ionic/core'
import { useEffect } from 'react'

// only exit app if user is on root path
const ROOT_PATHS = ['/tabs/groups', '/tabs/contacts']

export const useAppExit = () => {
  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      const customEvent = ev as BackButtonEvent
      // modal has 100 as priority, so we have to process it first
      customEvent.detail.register(10, processNextHandler => {
        const currentPath = window.location.pathname
        if (ROOT_PATHS.includes(currentPath)) {
          CapacitorApp.exitApp()
        } else {
          processNextHandler()
        }
      })
    }
    document.addEventListener('ionBackButton', handleBackButton)
    return () => {
      document.removeEventListener('ionBackButton', handleBackButton)
    }
  }, [])
}
