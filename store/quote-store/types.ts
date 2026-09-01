import {
  HealthAnswer,
  InsuranceFlowStep,
  PersonalDetails,
} from '@/features/insurance-flow';

export type QuoteState = {
  currentStep: InsuranceFlowStep;
  personal: PersonalDetails;
  healthAnswer: HealthAnswer | null;
  quoteSent: boolean;
  hasHydrated: boolean;
  setStep: (step: InsuranceFlowStep) => void;
  updatePersonal: (details: Partial<PersonalDetails>) => void;
  setHealthAnswer: (answer: HealthAnswer) => void;
  setQuoteSent: (sent: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  reset: () => void;
};
