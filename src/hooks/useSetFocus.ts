import { RefObject, useEffect } from 'react'

export const useSetFocus = (ref: RefObject<HTMLIonInputElement>, timeout: number = 0, condition = false) => {
  useEffect(() => {
    if (condition) return

    if (timeout === 0) {
      ref.current?.setFocus()
      return
    }
    // If it needs some time before it can be focused
    setTimeout(() => ref.current?.setFocus(), timeout)
  }, [ref, timeout, condition])
}
