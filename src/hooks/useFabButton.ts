import { not } from 'ramda'
import { useState } from 'react'

export const useFabButton = () => {
  const [activated, setActivated] = useState(false)

  const onClickFabButton = () => {
    setActivated(not)
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
