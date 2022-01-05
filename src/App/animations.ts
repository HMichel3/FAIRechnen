export const variantProps = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
}

const defaultDuration = 0.3

export const fadeOutRightVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    x: '100%',
    transition: { ease: 'linear', duration: defaultDuration },
  },
}

export const fadeOutLeftVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    x: '-100%',
    transition: { ease: 'linear', duration: defaultDuration },
  },
}

export const fadeInOutTopVariants = {
  initial: {
    opacity: 0,
    y: '-100%',
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ease: 'easeOut', duration: defaultDuration },
  },
  exit: {
    opacity: 0,
    y: '-100%',
    transition: { ease: 'easeOut', duration: defaultDuration },
  },
}
