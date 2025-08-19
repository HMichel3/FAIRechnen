type ShowProps = {
  when: boolean
  children: JSX.Element
  fallback?: JSX.Element | null
}

export const Show = ({ when, children, fallback = null }: ShowProps): JSX.Element | null => (when ? children : fallback)
