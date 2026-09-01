'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { QuoteState } from './types';
import {
  INITIAL_PERSONAL_DETAILS,
  INSURANCE_FLOW_STORAGE_KEY,
} from './constants';

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      currentStep: 1,
      personal: INITIAL_PERSONAL_DETAILS,
      healthAnswer: null,
      quoteSent: false,
      hasHydrated: false,
      setStep: (currentStep) => set({ currentStep }),
      updatePersonal: (details) =>
        set((state) => ({ personal: { ...state.personal, ...details } })),
      setHealthAnswer: (healthAnswer) => set({ healthAnswer }),
      setQuoteSent: (quoteSent) => set({ quoteSent }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      reset: () =>
        set({
          currentStep: 1,
          personal: INITIAL_PERSONAL_DETAILS,
          healthAnswer: null,
          quoteSent: false,
        }),
    }),
    {
      name: INSURANCE_FLOW_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: (state) => ({
        currentStep: state.currentStep,
        personal: state.personal,
        healthAnswer: state.healthAnswer,
        quoteSent: state.quoteSent,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
