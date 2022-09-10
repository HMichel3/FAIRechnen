import { StateCreator } from 'zustand'
import { SelectedGroup } from '../types'
import { StoreState } from '../useStore'

export interface SelectedGroupSlice {
  selectedGroup: SelectedGroup
  setSelectedGroup: (selectedGroup: SelectedGroup) => void
  clearSelectedGroup: () => void
}

const initialSelectedGroup: SelectedGroup = {
  id: '',
  name: '',
  members: [],
  purchases: [],
  incomes: [],
  compensations: [],
  timestamp: 0,
  membersWithAmounts: [],
  sortedPayments: [],
}

export const createSelectedGroupSlice: StateCreator<StoreState, [], [], SelectedGroupSlice> = set => ({
  selectedGroup: initialSelectedGroup,
  setSelectedGroup: selectedGroup => set({ selectedGroup }),
  clearSelectedGroup: () => set({ selectedGroup: initialSelectedGroup }),
})
