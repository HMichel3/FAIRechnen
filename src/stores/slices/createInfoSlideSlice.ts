import { PersistImmer } from '../usePersistedStore'

export type InfoSlideSlice = {
  isInfoSlideOpen: boolean
  openInfoSlides: () => void
  closeInfoSlides: () => void
}

export const createInfoSlideSlice: PersistImmer<InfoSlideSlice> = set => ({
  isInfoSlideOpen: true,
  openInfoSlides: () => set({ isInfoSlideOpen: true }),
  closeInfoSlides: () => set({ isInfoSlideOpen: false }),
})
