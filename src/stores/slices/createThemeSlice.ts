import { SetState } from 'zustand'
import { PersistedState } from '../usePersistedStore'

export interface ThemeSlice {
  theme: null | 'dark'
  setTheme: (theme: null | 'dark') => void
}

export const createThemeSlice = (set: SetState<PersistedState>): ThemeSlice => ({
  theme: 'dark',
  setTheme: theme => set({ theme }),
})
