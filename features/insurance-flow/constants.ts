import { HeartPulse, Sparkles, UserRound } from 'lucide-react';

import type { InsuranceFlowStepDefinition } from './types';

export const INSURANCE_FLOW_STEPS: InsuranceFlowStepDefinition[] = [
  { number: 1, label: 'Kişisel Bilgiler', icon: UserRound },
  { number: 2, label: 'Sağlık Beyanı', icon: HeartPulse },
  { number: 3, label: 'Teklif Detayları', icon: Sparkles },
];
