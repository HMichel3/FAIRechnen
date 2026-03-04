import Lottie from 'lottie-react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../stores/useStore'
import { fadeOutVariants } from '../utils/animation'
import checkmarkAnimation from './checkmark.json'

export const SuccessAnimation = () => {
  const isAnimationVisible = useStore(s => s.isAnimationVisible)
  const hideAnimation = useStore(s => s.hideAnimation)

  return (
    <AnimatePresence>
      {isAnimationVisible && (
        <motion.div className='absolute inset-0 grid place-items-center' {...fadeOutVariants}>
          <Lottie
            className='h-auto w-[250px]'
            animationData={checkmarkAnimation}
            loop={false}
            onComplete={hideAnimation}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
