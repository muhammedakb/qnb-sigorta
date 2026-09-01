'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useQuoteStore } from '@/store/quote-store';
import { InsuranceFlowStepDefinition } from '@/features/insurance-flow';

export function Stepper({ steps }: { steps: InsuranceFlowStepDefinition[] }) {
  const currentStep = useQuoteStore((state) => state.currentStep);
  const setStep = useQuoteStore((state) => state.setStep);

  return (
    <nav aria-label='Teklif adımları' className='mx-auto w-full max-w-5xl'>
      <ol className='grid grid-cols-3 overflow-hidden rounded-2xl border bg-card shadow-sm'>
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isComplete = currentStep > step.number;
          const canVisit = step.number <= currentStep;
          const Icon = step.icon;

          return (
            <li
              key={step.number}
              className={cn(
                'relative min-w-0 border-r last:border-r-0',
                isActive && 'bg-primary/[0.04]',
              )}
            >
              <button
                type='button'
                disabled={!canVisit}
                onClick={() => canVisit && setStep(step.number)}
                aria-current={isActive ? 'step' : undefined}
                className='flex w-full items-center gap-2.5 px-3 py-3.5 text-left transition-colors enabled:hover:bg-muted/60 disabled:cursor-default sm:px-6 sm:py-5'
              >
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors sm:size-10',
                    isActive &&
                      'border-primary bg-primary text-primary-foreground',
                    isComplete &&
                      'border-primary/20 bg-primary/10 text-primary',
                    !isActive &&
                      !isComplete &&
                      'bg-muted text-muted-foreground',
                  )}
                >
                  {isComplete ? (
                    <Check className='size-4' />
                  ) : (
                    <Icon className='size-4' />
                  )}
                </span>
                <span className='min-w-0'>
                  <span className='hidden text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block'>
                    {step.number}. adım
                  </span>
                  <span
                    className={cn(
                      'block truncate text-xs font-medium sm:text-sm',
                      isActive ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {step.label}
                  </span>
                </span>
              </button>
              {index < steps.length - 1 && (
                <span className='absolute right-0 top-1/2 z-10 hidden size-3 -translate-y-1/2 translate-x-1/2 rotate-45 border-r border-t bg-card md:block' />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
