import { PersistImmer } from '../usePersistedStore'

export interface ThemeSlice {
  theme: 'dark' | 'white'
  setTheme: (theme: ThemeSlice['theme']) => void
}

export const createThemeSlice: PersistImmer<ThemeSlice> = set => ({
  theme: 'dark',
  setTheme: theme => set({ theme }),
})
