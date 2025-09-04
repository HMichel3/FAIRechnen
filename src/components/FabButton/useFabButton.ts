import { not } from 'ramda'
import { useState } from 'react'

export const useFabButton = () => {
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [activated, setActivated] = useState(false)

  const onClickFabButton = () => {
    setShowBackdrop(not)
    setActivated(not)
  }

  const onClickBackdrop = () => {
    setShowBackdrop(false)
    setActivated(false)
  }

  const onClickFabButtonInList = (onClick: () => void) => {
    setShowBackdrop(false)
    onClick()
    setActivated(false)
  }

  return { showBackdrop, activated, onClickFabButton, onClickFabButtonInList, onClickBackdrop }
}
