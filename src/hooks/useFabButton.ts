import { BackButtonEvent } from '@ionic/react'
import { useCallback, useEffect, useState } from 'react'

export const useFabButton = () => {
  const [activated, setActivated] = useState(false)

  const onClickFabButton = () => {
    setActivated(prev => !prev)
  }

  const onClickBackdrop = useCallback(() => {
    setActivated(false)
  }, [])

  const onClickFabButtonInList = (onClick?: () => void) => {
    onClick?.()
    setActivated(false)
  }

  // close fab options when back button is used
  useEffect(() => {
    if (!activated) return
    const handleBackButton = (ev: Event) => {
      const customEvent = ev as BackButtonEvent
      customEvent.detail.register(100, () => {
        onClickBackdrop()
      })
    }
    document.addEventListener('ionBackButton', handleBackButton)
    return () => {
      document.removeEventListener('ionBackButton', handleBackButton)
    }
  }, [activated, onClickBackdrop])

  return { activated, onClickFabButton, onClickFabButtonInList, onClickBackdrop }
}
