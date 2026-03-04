import { Variants } from 'motion'

const defaultDuration = 0.3

export const fadeOutVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeOutRightVariants: Variants = {
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

export const fadeOutLeftVariants: Variants = {
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

export const fadeInOutTopVariants: Variants = {
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
