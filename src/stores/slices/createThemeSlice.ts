import { SetState } from 'zustand'
import { PersistedState } from '../usePersistedStore'

export interface ThemeSlice {
  theme: 'dark' | 'white'
  setTheme: (theme: ThemeSlice['theme']) => void
}

export const createThemeSlice = (set: SetState<PersistedState>): ThemeSlice => ({
  theme: 'dark',
  setTheme: theme => set({ theme }),
})
