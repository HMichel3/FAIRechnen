import { useCallback, useState } from 'react'

type OverlayState<T> = { isOpen: boolean; selected: T | null }

export const useOverlay = <T>() => {
  const [state, setState] = useState<OverlayState<T>>({
    isOpen: false,
    selected: null,
  })

  const onOpen = useCallback(() => {
    setState({ isOpen: true, selected: null })
  }, [])

  const onSelect = useCallback((value: T) => {
    setState({ isOpen: true, selected: value })
  }, [])

  const onDidDismiss = useCallback(() => {
    setState({ isOpen: false, selected: null })
  }, [])

  const onDismiss = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    ...state,
    onOpen,
    onSelect,
    onDidDismiss,
    onDismiss,
  }
}
