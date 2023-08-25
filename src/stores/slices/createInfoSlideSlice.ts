import { PersistImmer } from '../usePersistedStore'

export interface InfoSlideSlice {
  showInfoSlides: boolean
  setShowInfoSlides: (showInfoSlides: boolean) => void
}

export const createInfoSlideSlice: PersistImmer<InfoSlideSlice> = set => ({
  showInfoSlides: true,
  setShowInfoSlides: (showInfoSlides: boolean) => set({ showInfoSlides }),
})
