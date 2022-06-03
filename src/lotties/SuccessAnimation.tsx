import { useLottie, Lottie } from 'react-lottie-hook'
import successful from './successful.json'

export const SuccessAnimation = (): JSX.Element => {
  const [lottieRef] = useLottie({ loop: false, autoplay: true, animationData: successful })

  return <Lottie lottieRef={lottieRef} style={{ position: 'absolute', width: '100%', height: '100%' }} />
}
