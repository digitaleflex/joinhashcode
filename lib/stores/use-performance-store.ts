import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PerformanceState {
  lowPowerMode: boolean;
  toggleLowPowerMode: () => void;
  setLowPowerMode: (value: boolean) => void;
}

export const usePerformanceStore = create<PerformanceState>()(
  persist(
    (set) => ({
      lowPowerMode: false,
      toggleLowPowerMode: () => set((state: PerformanceState) => ({ lowPowerMode: !state.lowPowerMode })),
      setLowPowerMode: (value: boolean) => set({ lowPowerMode: value }),
    }),
    {
      name: 'hashcode-performance-settings',
    }
  )
);
