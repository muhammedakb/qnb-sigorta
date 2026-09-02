'use client';

import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CircleHelp,
  Send,
  ShieldCheck,
} from 'lucide-react';
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

import { useQuoteStore } from '@/store/quote-store';

import { QUOTE_BENEFITS } from './constants';
import { useShallow } from 'zustand/shallow';

export function QuoteStep() {
  const { personal, healthAnswer, quoteSent, setQuoteSent, setStep } =
    useQuoteStore(
      useShallow((state) => ({
        personal: state.personal,
        healthAnswer: state.healthAnswer,
        quoteSent: state.quoteSent,
        setQuoteSent: state.setQuoteSent,
        setStep: state.setStep,
      })),
    );

  return (
    <div className='mx-auto w-full max-w-4xl'>
      <div className='mb-7 text-center'>
        <span className='inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-primary shadow-sm'>
          <BadgeCheck className='size-3.5' /> Teklifiniz hazır
        </span>
        <h2 className='mt-3 text-2xl font-semibold tracking-tight sm:text-3xl'>
          İhtiyacınıza uygun sade bir plan
        </h2>
        <p className='mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground'>
          Demo bilgileriniz kullanılarak örnek bir tamamlayıcı sağlık sigortası
          teklifi oluşturuldu.
        </p>
      </div>

      {quoteSent && (
        <div className='mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950'>
          <CheckCircle2 className='mt-0.5 size-5 shrink-0 text-emerald-600' />
          <div>
            <p className='font-medium'>Teklif e-posta adresinize gönderildi.</p>
            <p className='mt-0.5 text-emerald-800/80'>
              Demo bildirim: {personal.email}
            </p>
          </div>
        </div>
      )}

      <div className='grid gap-5 md:grid-cols-[1.35fr_0.65fr]'>
        <Card className='border-0 shadow-xl shadow-slate-200/60 ring-1 ring-border/70'>
          <CardHeader className='border-b px-6 pb-5 sm:px-8'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <CardDescription>Önerilen plan</CardDescription>
                <CardTitle className='mt-1 text-xl'>
                  Avantaj Tamamlayıcı Sağlık
                </CardTitle>
              </div>
              <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
                <ShieldCheck className='size-5' />
              </div>
            </div>
          </CardHeader>
          <CardContent className='px-6 pt-6 sm:px-8'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
              <div>
                <div className='mb-2 flex gap-2'>
                  <span className='rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700'>
                    %10 Hoş geldin
                  </span>
                  <span className='rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700'>
                    %10 Peşin
                  </span>
                </div>
                <p className='text-sm text-muted-foreground line-through'>
                  6.240,00 TL
                </p>
                <p className='mt-1 text-3xl font-semibold tracking-tight text-primary'>
                  4.995,00 TL
                </p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Yıllık peşin ödeme
                </p>
              </div>
              <div className='rounded-xl bg-muted/70 px-4 py-3 text-right'>
                <p className='text-xs text-muted-foreground'>Aylık karşılığı</p>
                <p className='mt-0.5 font-semibold'>416,25 TL</p>
              </div>
            </div>

            <Separator className='my-6' />
            <div className='grid gap-4 sm:grid-cols-2'>
              {QUOTE_BENEFITS.map(([label, value]) => (
                <div
                  key={label}
                  className='rounded-xl border bg-muted/20 p-3.5'
                >
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    {label} <CircleHelp className='size-3.5' />
                  </div>
                  <p className='mt-1.5 text-sm font-medium'>{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className='grid grid-cols-2 gap-3 px-6 py-4 sm:px-8'>
            <Button
              variant='outline'
              size='lg'
              onClick={() => setQuoteSent(true)}
            >
              <Send /> Teklifi gönder
            </Button>
            <Button size='lg' onClick={() => setQuoteSent(true)}>
              Satın alma demosu
            </Button>
          </CardFooter>
        </Card>

        <Card className='h-fit bg-slate-950 text-white ring-0'>
          <CardHeader>
            <CardTitle className='text-base text-white'>
              Başvuru özeti
            </CardTitle>
            <CardDescription className='text-slate-400'>
              Oturumda kayıtlı bilgiler
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-xs text-slate-400'>E-posta</p>
              <p className='mt-1 break-all text-sm text-slate-100'>
                {personal.email}
              </p>
            </div>
            <div>
              <p className='text-xs text-slate-400'>Meslek</p>
              <p className='mt-1 text-sm text-slate-100'>
                {personal.occupation}
              </p>
            </div>
            <div>
              <p className='text-xs text-slate-400'>Sağlık beyanı</p>
              <p className='mt-1 text-sm text-slate-100'>
                {healthAnswer === 'yes'
                  ? 'Tanı / tedavi mevcut'
                  : 'Tanı / tedavi yok'}
              </p>
            </div>
            <div className='flex items-center gap-2 rounded-lg bg-white/8 p-3 text-xs leading-relaxed text-slate-300'>
              <ShieldCheck className='size-4 shrink-0 text-fuchsia-300' />
              Sayfayı yenilediğinizde bu adım ve bilgiler korunur.
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant='ghost' className='mt-5' onClick={() => setStep(2)}>
        <ArrowLeft /> Sağlık beyanına dön
      </Button>
    </div>
  );
}
