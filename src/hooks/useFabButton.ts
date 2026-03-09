import { useState } from 'react'

export const useFabButton = () => {
  const [activated, setActivated] = useState(false)

  const onClickFabButton = () => {
    setActivated(prev => !prev)
  }

  const onClickBackdrop = () => {
    setActivated(false)
  }

  const onClickFabButtonInList = (onClick?: () => void) => {
    onClick?.()
    setActivated(false)
  }

  return { activated, onClickFabButton, onClickFabButtonInList, onClickBackdrop }
}
