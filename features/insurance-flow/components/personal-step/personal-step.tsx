'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@muhammedakb/qnb-ui/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@muhammedakb/qnb-ui/data-display';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  InputShell,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@muhammedakb/qnb-ui/forms';
import { OtpVerificationDialog } from '@muhammedakb/qnb-ui/overlays';

import { useQuoteStore } from '@/store/quote-store';

import type { PersonalDetails } from '../../types';
import { OCCUPATIONS } from './constants';
import { personalDetailsSchema } from './validations';

export function PersonalStep() {
  const personal = useQuoteStore((state) => state.personal);
  const updatePersonal = useQuoteStore((state) => state.updatePersonal);
  const setStep = useQuoteStore((state) => state.setStep);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalDetails>({
    resolver: yupResolver(personalDetailsSchema),
    defaultValues: personal,
    mode: 'onTouched',
  });

  const restored = useRef(false);
  useEffect(() => {
    if (!restored.current) {
      reset(useQuoteStore.getState().personal);
      restored.current = true;
    }
  }, [reset]);

  const submitPersonal = (values: PersonalDetails) => {
    updatePersonal(values);
    setOtp('');
    setOtpError('');
    setSecurityOpen(true);
  };

  const verifyOtp = (value: string) => {
    if (value.length !== 6) {
      setOtpError('Lütfen 6 haneli doğrulama kodunu girin.');
      return;
    }
    setOtp(value);
    setSecurityOpen(false);
    setStep(2);
  };

  return (
    <>
      <Card className='mx-auto w-full max-w-2xl border-0 shadow-xl shadow-slate-200/60 ring-1 ring-border/70'>
        <CardHeader className='gap-2 border-b px-6 pb-5 sm:px-8'>
          <div className='mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
            <UserRound className='size-5' />
          </div>
          <CardTitle className='text-xl sm:text-2xl'>
            Sizi biraz tanıyalım
          </CardTitle>
          <CardDescription className='max-w-lg leading-relaxed'>
            Size özel teklifi hazırlayabilmemiz için iletişim bilgilerinizi
            paylaşın.
          </CardDescription>
        </CardHeader>
        <CardContent className='px-6 pt-6 sm:px-8'>
          <form
            id='personal-form'
            onSubmit={handleSubmit(submitPersonal)}
            noValidate
          >
            <FieldGroup className='grid gap-5 sm:grid-cols-2'>
              <Field data-invalid={!!errors.identityNumber}>
                <FieldLabel htmlFor='identityNumber'>
                  T.C. kimlik numarası
                </FieldLabel>
                <InputShell icon={UserRound}>
                  <Input
                    id='identityNumber'
                    inputMode='numeric'
                    maxLength={11}
                    placeholder='11 haneli kimlik numarası'
                    className='h-11 pl-10'
                    aria-invalid={!!errors.identityNumber}
                    {...register('identityNumber', {
                      onChange: (event) => {
                        const value = event.target.value
                          .replace(/\D/g, '')
                          .slice(0, 11);
                        event.target.value = value;
                        updatePersonal({ identityNumber: value });
                      },
                    })}
                  />
                </InputShell>
                <FieldError errors={[errors.identityNumber]} />
              </Field>

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor='phone'>Cep telefonu</FieldLabel>
                <InputShell icon={Phone}>
                  <Input
                    id='phone'
                    inputMode='tel'
                    maxLength={10}
                    placeholder='5XX XXX XX XX'
                    className='h-11 pl-10'
                    aria-invalid={!!errors.phone}
                    {...register('phone', {
                      onChange: (event) => {
                        const value = event.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10);
                        event.target.value = value;
                        updatePersonal({ phone: value });
                      },
                    })}
                  />
                </InputShell>
                <FieldError errors={[errors.phone]} />
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor='email'>E-posta adresi</FieldLabel>
                <InputShell icon={Mail}>
                  <Input
                    id='email'
                    type='email'
                    placeholder='ornek@eposta.com'
                    className='h-11 pl-10'
                    aria-invalid={!!errors.email}
                    {...register('email', {
                      onChange: (event) =>
                        updatePersonal({ email: event.target.value }),
                    })}
                  />
                </InputShell>
                <FieldError errors={[errors.email]} />
              </Field>

              <Controller
                name='occupation'
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.occupation}>
                    <FieldLabel htmlFor='occupation'>Mesleğiniz</FieldLabel>
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => {
                        const nextValue = value ?? '';
                        field.onChange(nextValue);
                        updatePersonal({ occupation: nextValue });
                      }}
                    >
                      <SelectTrigger
                        id='occupation'
                        className='h-11 w-full pl-3'
                        aria-invalid={!!errors.occupation}
                      >
                        <BriefcaseBusiness className='size-4 text-muted-foreground' />
                        <SelectValue placeholder='Meslek seçin' />
                      </SelectTrigger>
                      <SelectContent align='start'>
                        {OCCUPATIONS.map((occupation) => (
                          <SelectItem key={occupation} value={occupation}>
                            {occupation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.occupation]} />
                  </Field>
                )}
              />
            </FieldGroup>
            <div className='mt-6 flex items-start gap-2 rounded-xl bg-muted/60 p-3.5 text-xs leading-relaxed text-muted-foreground'>
              <ShieldCheck className='mt-0.5 size-4 shrink-0 text-primary' />
              Bu ekran yalnızca arayüz demosudur. Girilen bilgiler sunucuya
              gönderilmez ve yalnızca bu sekmenin oturumunda saklanır.
            </div>
          </form>
        </CardContent>
        <CardFooter className='justify-end px-6 py-4 sm:px-8'>
          <Button
            type='submit'
            form='personal-form'
            size='lg'
            className='h-11 min-w-36'
          >
            Devam et <ArrowRight />
          </Button>
        </CardFooter>
      </Card>

      <OtpVerificationDialog
        open={securityOpen}
        onOpenChange={setSecurityOpen}
        value={otp}
        onValueChange={(value) => {
          setOtp(value);
          setOtpError('');
        }}
        onVerify={verifyOtp}
        error={otpError}
      />
    </>
  );
}
