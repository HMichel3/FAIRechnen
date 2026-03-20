import { useLottie } from 'lottie-react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../stores/useStore'
import { fadeOutVariants } from '../utils/animation'
import animationData from './checkmark.json'

type CheckmarkPlayerProps = {
  onComplete: () => void
}

const CheckmarkPlayer = ({ onComplete }: CheckmarkPlayerProps) => {
  const { View } = useLottie({
    className: 'h-auto w-[250px]',
    animationData,
    onComplete,
    loop: false,
  })

  return View
}

export const SuccessAnimation = () => {
  const isAnimationVisible = useStore(s => s.isAnimationVisible)
  const hideAnimation = useStore(s => s.hideAnimation)

  return (
    <AnimatePresence>
      {isAnimationVisible && (
        <motion.div className='absolute inset-0 grid place-items-center' {...fadeOutVariants}>
          <CheckmarkPlayer onComplete={hideAnimation} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
