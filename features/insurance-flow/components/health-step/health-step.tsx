'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, ArrowRight, Check, HeartPulse } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@muhammedakb/qnb-ui/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@muhammedakb/qnb-ui/data-display';
import { Separator } from '@muhammedakb/qnb-ui/layout';

import { cn } from '@/lib/utils';
import { useQuoteStore } from '@/store/quote-store';

import type { HealthAnswer } from '../../types';
import { HEALTH_CONDITIONS } from './constants';
import type { HealthForm } from './types';
import { healthSchema } from './validations';
import { useShallow } from 'zustand/shallow';

export function HealthStep() {
  const { healthAnswer, setHealthAnswer, setStep } = useQuoteStore(
    useShallow((state) => ({
      healthAnswer: state.healthAnswer,
      setHealthAnswer: state.setHealthAnswer,
      setStep: state.setStep,
    })),
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HealthForm>({
    resolver: yupResolver(healthSchema),
    defaultValues: { answer: healthAnswer ?? undefined },
  });
  const answer = useWatch({ control, name: 'answer' });

  const selectAnswer = (value: HealthAnswer) => {
    setValue('answer', value, { shouldValidate: true });
    setHealthAnswer(value);
  };

  return (
    <Card className='mx-auto w-full max-w-4xl border-0 shadow-xl shadow-slate-200/60 ring-1 ring-border/70'>
      <CardHeader className='items-center gap-2 border-b px-6 pb-6 text-center sm:px-10'>
        <div className='mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
          <HeartPulse className='size-5' />
        </div>
        <CardTitle className='text-xl sm:text-2xl'>Sağlık beyanınız</CardTitle>
        <CardDescription className='max-w-2xl text-balance leading-relaxed'>
          Aşağıdaki rahatsızlıklardan biri için tanı aldınız veya tedavi
          gördünüz mü?
        </CardDescription>
      </CardHeader>
      <CardContent className='px-6 pt-6 sm:px-10'>
        <div className='grid gap-x-10 gap-y-3 sm:grid-cols-2'>
          {HEALTH_CONDITIONS.map((condition) => (
            <div
              key={condition}
              className='flex items-start gap-3 rounded-lg px-2 py-1.5 text-sm'
            >
              <span className='mt-1.5 size-1.5 shrink-0 rotate-45 rounded-[1px] bg-primary' />
              <span className='leading-relaxed text-foreground/80'>
                {condition}
              </span>
            </div>
          ))}
        </div>
        <Separator className='my-6' />
        <form
          id='health-form'
          onSubmit={handleSubmit(() => setStep(3))}
          className='space-y-3'
        >
          <div className='grid gap-3 sm:grid-cols-2'>
            <button
              type='button'
              onClick={() => selectAnswer('yes')}
              aria-pressed={answer === 'yes'}
              className={cn(
                'flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
                answer === 'yes' &&
                  'border-primary bg-primary/[0.06] ring-1 ring-primary',
              )}
            >
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full border',
                  answer === 'yes' &&
                    'border-primary bg-primary text-primary-foreground',
                )}
              >
                {answer === 'yes' && <Check className='size-3.5' />}
              </span>
              Evet, tanı veya tedavi aldım
            </button>
            <button
              type='button'
              onClick={() => selectAnswer('no')}
              aria-pressed={answer === 'no'}
              className={cn(
                'flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
                answer === 'no' &&
                  'border-primary bg-primary/[0.06] ring-1 ring-primary',
              )}
            >
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full border',
                  answer === 'no' &&
                    'border-primary bg-primary text-primary-foreground',
                )}
              >
                {answer === 'no' && <Check className='size-3.5' />}
              </span>
              Hayır, tanı veya tedavi almadım
            </button>
          </div>
          {errors.answer && (
            <p role='alert' className='text-sm text-destructive'>
              {errors.answer.message}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className='justify-between px-6 py-4 sm:px-10'>
        <Button variant='ghost' size='lg' onClick={() => setStep(1)}>
          <ArrowLeft /> Geri
        </Button>
        <Button
          type='submit'
          form='health-form'
          size='lg'
          className='h-11 min-w-36'
        >
          Teklifi gör <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
