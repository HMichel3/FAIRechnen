import { DependencyList, EffectCallback, useEffect } from 'react'
import { useTimeout } from './useTimeout'

export const useDebounce = (callback: EffectCallback, delay: number, dependencies: DependencyList) => {
  const { reset, clear } = useTimeout(callback, delay)
  useEffect(reset, [...dependencies, reset])
  useEffect(clear, [clear])
}
