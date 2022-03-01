import { equals } from 'ramda'
import { DependencyList, useMemo, useRef } from 'react'

// Use this inside of useSelectedGroup, if the performance is to bad
export const useDeepCompareMemo = <T>(factory: () => T, dependencies?: DependencyList) => {
  const currentDependenciesRef = useRef<DependencyList>()

  if (!equals(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies
  }

  return useMemo(factory, [currentDependenciesRef.current]) // eslint-disable-line react-hooks/exhaustive-deps
}
