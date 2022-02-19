import { SetState } from 'zustand'
import { SelectedGroup } from '../../App/types'
import { StoreState } from '../useStore'

export interface SelectedGroupSlice {
  selectedGroup: SelectedGroup
  setSelectedGroup: (selectedGroup: SelectedGroup) => void
  clearSelectedGroup: () => void
}

const initialSelectedGroup: SelectedGroup = {
  group: { groupId: '', name: '', timestamp: 0, totalAmount: 0 },
  groupMembers: [],
  groupPayments: [],
}

export const createSelectedGroupSlice = (set: SetState<StoreState>): SelectedGroupSlice => ({
  selectedGroup: initialSelectedGroup,
  setSelectedGroup: selectedGroup => set({ selectedGroup }),
  clearSelectedGroup: () => set({ selectedGroup: initialSelectedGroup }),
})
