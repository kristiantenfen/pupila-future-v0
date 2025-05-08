"use client"

import { create } from "zustand"

interface AssetStoreState {
  elements: any[]
  setElements: (elements: any[]) => void
  resetElements: (defaultElements?: any[]) => void
}

export const useAssetStore = create<AssetStoreState>((set) => ({
  elements: [],
  setElements: (elements) => set({ elements }),
  resetElements: (defaultElements = []) => set({ elements: defaultElements }),
}))
