import { SetState } from 'zustand'
import { Group } from '../types'
import { StoreState } from '../useStore'

export interface SelectedGroupSlice {
  selectedGroup: Group
  setSelectedGroup: (selectedGroup: Group) => void
  clearSelectedGroup: () => void
}

const initialSelectedGroup: Group = {
  id: '',
  name: '',
  members: [],
  purchases: [],
  incomes: [],
  compensations: [],
  timestamp: 0,
}

export const createSelectedGroupSlice = (set: SetState<StoreState>): SelectedGroupSlice => ({
  selectedGroup: initialSelectedGroup,
  setSelectedGroup: selectedGroup => set({ selectedGroup }),
  clearSelectedGroup: () => set({ selectedGroup: initialSelectedGroup }),
})
