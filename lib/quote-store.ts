"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type PersonalDetails = {
  identityNumber: string
  phone: string
  email: string
  occupation: string
}

type QuoteState = {
  currentStep: 1 | 2 | 3
  personal: PersonalDetails
  healthAnswer: "yes" | "no" | null
  quoteSent: boolean
  hasHydrated: boolean
  setStep: (step: 1 | 2 | 3) => void
  updatePersonal: (details: Partial<PersonalDetails>) => void
  setHealthAnswer: (answer: "yes" | "no") => void
  setQuoteSent: (sent: boolean) => void
  setHasHydrated: (hydrated: boolean) => void
  reset: () => void
}

const initialPersonal: PersonalDetails = {
  identityNumber: "",
  phone: "",
  email: "",
  occupation: "",
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      currentStep: 1,
      personal: initialPersonal,
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
          personal: initialPersonal,
          healthAnswer: null,
          quoteSent: false,
        }),
    }),
    {
      name: "qnb-demo-quote",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: (state) => ({
        currentStep: state.currentStep,
        personal: state.personal,
        healthAnswer: state.healthAnswer,
        quoteSent: state.quoteSent,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
)
