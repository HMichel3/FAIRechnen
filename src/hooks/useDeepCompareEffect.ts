import { equals } from 'ramda'
import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

// Use this inside of groupInfoPage, if the performance is to bad
export const useDeepCompareEffect = (callback: EffectCallback, dependencies?: DependencyList) => {
  const currentDependenciesRef = useRef<DependencyList>()

  if (!equals(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies
  }

  useEffect(callback, [currentDependenciesRef.current]) // eslint-disable-line react-hooks/exhaustive-deps
}
