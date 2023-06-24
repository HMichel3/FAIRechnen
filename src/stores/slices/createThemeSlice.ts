import { PersistImmer } from '../usePersistedStore'

export interface ThemeSlice {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const createThemeSlice: PersistImmer<ThemeSlice> = set => ({
  theme: 'dark',
  setTheme: theme => set({ theme }),
})
