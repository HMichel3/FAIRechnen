import { ReactNode } from 'react'

type ShowProps<T> = {
  when: T | undefined | null | false
  fallback?: ReactNode
  children: ReactNode | ((item: T) => ReactNode)
}

export function Show<T>({ when, fallback = null, children }: ShowProps<T>) {
  if (!when) return <>{fallback}</>

  if (typeof children === 'function') {
    return <>{children(when)}</>
  }

  return <>{children}</>
}
