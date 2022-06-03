import { StateCreator } from 'zustand'
import { PersistImmer, PersistedState } from '../usePersistedStore'

export interface ThemeSlice {
  theme: 'dark' | 'white'
  setTheme: (theme: ThemeSlice['theme']) => void
}

export const createThemeSlice: StateCreator<PersistedState, PersistImmer, [], ThemeSlice> = set => ({
  theme: 'dark',
  setTheme: theme => set({ theme }),
})
