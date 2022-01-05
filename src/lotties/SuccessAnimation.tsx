import { useLottie, Lottie } from 'react-lottie-hook'
import success from './success.json'

export const SuccessAnimation = (): JSX.Element => {
  const [lottieRef] = useLottie({ loop: false, autoplay: true, animationData: success })

  return <Lottie lottieRef={lottieRef} style={{ width: '100%', height: '100%' }} />
}
