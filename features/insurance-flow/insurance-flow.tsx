'use client';

import { RefreshCcw, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/core/button';

import { useQuoteStore } from '@/store/quote-store';

import { HealthStep } from './components/health-step';
import { PersonalStep } from './components/personal-step';
import { QuoteStep } from './components/quote-step';
import { FlowSkeleton, Stepper } from '@/components/composed';
import { INSURANCE_FLOW_STEPS } from './constants';

export function InsuranceFlow() {
  const currentStep = useQuoteStore((state) => state.currentStep);
  const hasHydrated = useQuoteStore((state) => state.hasHydrated);
  const reset = useQuoteStore((state) => state.reset);
  const [flowKey, setFlowKey] = useState(0);

  useEffect(() => {
    void useQuoteStore.persist.rehydrate();
  }, []);

  if (!hasHydrated) {
    return <FlowSkeleton />;
  }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_oklch(0.95_0.03_330),_transparent_28%),linear-gradient(to_bottom,_white,_oklch(0.98_0.01_260))]'>
      <header className='border-b bg-white/80 backdrop-blur'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm'>
              <ShieldCheck className='size-5' />
            </div>
            <div>
              <p className='font-semibold leading-tight'>Sağlığım Güvende</p>
              <p className='text-xs text-muted-foreground'>
                Tamamlayıcı sağlık sigortası
              </p>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              reset();
              setFlowKey((key) => key + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <RefreshCcw />
            <span className='hidden sm:inline'>Akışı sıfırla</span>
          </Button>
        </div>
      </header>

      <main className='px-4 py-7 sm:px-6 sm:py-10 lg:px-8'>
        <div className='mx-auto mb-7 max-w-3xl text-center sm:mb-9'>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-primary'>
            Online teklif
          </p>
          <h1 className='mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-4xl'>
            Tamamlayıcı Sağlık Sigortası
          </h1>
        </div>
        <Stepper steps={INSURANCE_FLOW_STEPS} />
        <div key={flowKey} className='mx-auto mt-7 max-w-6xl sm:mt-9'>
          {currentStep === 1 && <PersonalStep />}
          {currentStep === 2 && <HealthStep />}
          {currentStep === 3 && <QuoteStep />}
        </div>
      </main>

      <footer className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:px-6 lg:px-8'>
        <span>© 2026 Sağlığım Güvende Demo</span>
        <span className='hidden sm:inline'>
          Frontend sunumu · Gerçek teklif değildir
        </span>
      </footer>
    </div>
  );
}
