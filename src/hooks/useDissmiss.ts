import { useIonRouter } from '@ionic/react'

export const useDismiss = (target: string) => {
  const router = useIonRouter()

  const onDismiss = () => {
    if (router.canGoBack()) {
      router.goBack()
      return
    }
    router.push(target, 'back', 'replace')
  }

  return onDismiss
}
