import { useCallback, useState } from 'react'

export const useToggle = (defaultValue: boolean) => {
  const [value, setValue] = useState(defaultValue)

  const toggleValue = useCallback((value?: boolean) => {
    setValue(currentValue => value ?? !currentValue)
  }, [])

  return [value, toggleValue] as const
}
