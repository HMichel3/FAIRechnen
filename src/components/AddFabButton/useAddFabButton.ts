import { useState } from 'react'

export const useAddFabButton = () => {
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [showFab, setShowFab] = useState(false)

  const onClickFabButton = () => {
    setShowBackdrop(prevState => !prevState)
    setShowFab(prevState => !prevState)
  }

  const onClickBackdrop = () => {
    setShowBackdrop(false)
    setShowFab(false)
  }

  const onClickFabButtonInList = (onClick: () => void) => {
    setShowBackdrop(false)
    onClick()
    setShowFab(false)
  }

  return { showBackdrop, showFab, onClickFabButton, onClickFabButtonInList, onClickBackdrop }
}
