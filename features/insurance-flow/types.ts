import type { LucideIcon } from 'lucide-react';

export type InsuranceFlowStep = 1 | 2 | 3;

export type HealthAnswer = 'yes' | 'no';

export type PersonalDetails = {
  identityNumber: string;
  phone: string;
  email: string;
  occupation: string;
};

export type InsuranceFlowStepDefinition = {
  number: InsuranceFlowStep;
  label: string;
  icon: LucideIcon;
};
