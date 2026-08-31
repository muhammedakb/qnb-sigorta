"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  CircleHelp,
  HeartPulse,
  Info,
  Mail,
  Phone,
  RefreshCcw,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import * as yup from "yup"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { type PersonalDetails, useQuoteStore } from "@/lib/quote-store"

const steps = [
  { number: 1 as const, label: "Kişisel Bilgiler", icon: UserRound },
  { number: 2 as const, label: "Sağlık Beyanı", icon: HeartPulse },
  { number: 3 as const, label: "Teklif Detayları", icon: Sparkles },
]

const personalSchema: yup.ObjectSchema<PersonalDetails> = yup.object({
  identityNumber: yup
    .string()
    .required("T.C. kimlik numarası zorunludur.")
    .matches(/^\d{11}$/, "Kimlik numarası 11 haneli olmalıdır."),
  phone: yup
    .string()
    .required("Cep telefonu zorunludur.")
    .matches(/^5\d{9}$/, "Telefonu 5XX XXX XX XX biçiminde girin."),
  email: yup
    .string()
    .required("E-posta adresi zorunludur.")
    .email("Geçerli bir e-posta adresi girin."),
  occupation: yup.string().required("Lütfen mesleğinizi seçin."),
})

const healthSchema = yup.object({
  answer: yup
    .mixed<"yes" | "no">()
    .oneOf(["yes", "no"], "Devam etmek için bir seçim yapın.")
    .required("Devam etmek için bir seçim yapın."),
})

type HealthForm = yup.InferType<typeof healthSchema>

const healthConditions = [
  "Kalp ve dolaşım sistemi hastalıkları",
  "İnsülin kullanan diyabet",
  "Her türlü kanser",
  "Kan hastalıkları",
  "Organ yetmezlikleri veya organ nakli",
  "Sinir sistemi hastalıkları",
  "Doğumsal anomaliler",
  "Ülseratif kolit veya Crohn hastalığı",
  "Akciğer hastalıkları",
  "Bağışıklık sistemi hastalıkları",
  "Kas, iskelet ve romatizmal hastalıklar",
  "Beyin ve beyin damar hastalıkları",
  "Böbrek hastalıkları",
  "Karaciğer hastalıkları",
]

const occupations = [
  "Özel sektör çalışanı",
  "Kamu çalışanı",
  "Serbest meslek",
  "İşletme sahibi",
  "Emekli",
  "Öğrenci",
  "Diğer",
]

function Stepper() {
  const currentStep = useQuoteStore((state) => state.currentStep)
  const setStep = useQuoteStore((state) => state.setStep)

  return (
    <nav aria-label="Teklif adımları" className="mx-auto w-full max-w-5xl">
      <ol className="grid grid-cols-3 overflow-hidden rounded-2xl border bg-card shadow-sm">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isComplete = currentStep > step.number
          const canVisit = step.number <= currentStep
          const Icon = step.icon

          return (
            <li
              key={step.number}
              className={cn(
                "relative min-w-0 border-r last:border-r-0",
                isActive && "bg-primary/[0.04]"
              )}
            >
              <button
                type="button"
                disabled={!canVisit}
                onClick={() => canVisit && setStep(step.number)}
                aria-current={isActive ? "step" : undefined}
                className="flex w-full items-center gap-2.5 px-3 py-3.5 text-left transition-colors enabled:hover:bg-muted/60 disabled:cursor-default sm:px-6 sm:py-5"
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors sm:size-10",
                    isActive && "border-primary bg-primary text-primary-foreground",
                    isComplete && "border-primary/20 bg-primary/10 text-primary",
                    !isActive && !isComplete && "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check className="size-4" /> : <Icon className="size-4" />}
                </span>
                <span className="min-w-0">
                  <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block">
                    {step.number}. adım
                  </span>
                  <span
                    className={cn(
                      "block truncate text-xs font-medium sm:text-sm",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </span>
              </button>
              {index < steps.length - 1 && (
                <span className="absolute right-0 top-1/2 z-10 hidden size-3 -translate-y-1/2 translate-x-1/2 rotate-45 border-r border-t bg-card md:block" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function InputShell({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      {children}
    </div>
  )
}

function PersonalStep() {
  const personal = useQuoteStore((state) => state.personal)
  const updatePersonal = useQuoteStore((state) => state.updatePersonal)
  const setStep = useQuoteStore((state) => state.setStep)
  const [securityOpen, setSecurityOpen] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalDetails>({
    resolver: yupResolver(personalSchema),
    defaultValues: personal,
    mode: "onTouched",
  })

  const restored = useRef(false)
  useEffect(() => {
    if (!restored.current) {
      reset(useQuoteStore.getState().personal)
      restored.current = true
    }
  }, [reset])

  const submitPersonal = (values: PersonalDetails) => {
    updatePersonal(values)
    setOtp("")
    setOtpError("")
    setSecurityOpen(true)
  }

  const verifyOtp = () => {
    if (otp.length !== 6) {
      setOtpError("Lütfen 6 haneli doğrulama kodunu girin.")
      return
    }
    setSecurityOpen(false)
    setStep(2)
  }

  return (
    <>
      <Card className="mx-auto w-full max-w-2xl border-0 shadow-xl shadow-slate-200/60 ring-1 ring-border/70">
        <CardHeader className="gap-2 border-b px-6 pb-5 sm:px-8">
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">Sizi biraz tanıyalım</CardTitle>
          <CardDescription className="max-w-lg leading-relaxed">
            Size özel teklifi hazırlayabilmemiz için iletişim bilgilerinizi paylaşın.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pt-6 sm:px-8">
          <form id="personal-form" onSubmit={handleSubmit(submitPersonal)} noValidate>
            <FieldGroup className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.identityNumber}>
                <FieldLabel htmlFor="identityNumber">T.C. kimlik numarası</FieldLabel>
                <InputShell icon={UserRound}>
                  <Input
                    id="identityNumber"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="11 haneli kimlik numarası"
                    className="h-11 pl-10"
                    aria-invalid={!!errors.identityNumber}
                    {...register("identityNumber", {
                      onChange: (event) => {
                        const value = event.target.value.replace(/\D/g, "").slice(0, 11)
                        event.target.value = value
                        updatePersonal({ identityNumber: value })
                      },
                    })}
                  />
                </InputShell>
                <FieldError errors={[errors.identityNumber]} />
              </Field>

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone">Cep telefonu</FieldLabel>
                <InputShell icon={Phone}>
                  <Input
                    id="phone"
                    inputMode="tel"
                    maxLength={10}
                    placeholder="5XX XXX XX XX"
                    className="h-11 pl-10"
                    aria-invalid={!!errors.phone}
                    {...register("phone", {
                      onChange: (event) => {
                        const value = event.target.value.replace(/\D/g, "").slice(0, 10)
                        event.target.value = value
                        updatePersonal({ phone: value })
                      },
                    })}
                  />
                </InputShell>
                <FieldError errors={[errors.phone]} />
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">E-posta adresi</FieldLabel>
                <InputShell icon={Mail}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@eposta.com"
                    className="h-11 pl-10"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      onChange: (event) => updatePersonal({ email: event.target.value }),
                    })}
                  />
                </InputShell>
                <FieldError errors={[errors.email]} />
              </Field>

              <Controller
                name="occupation"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.occupation}>
                    <FieldLabel htmlFor="occupation">Mesleğiniz</FieldLabel>
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => {
                        const nextValue = value ?? ""
                        field.onChange(nextValue)
                        updatePersonal({ occupation: nextValue })
                      }}
                    >
                      <SelectTrigger
                        id="occupation"
                        className="h-11 w-full pl-3"
                        aria-invalid={!!errors.occupation}
                      >
                        <BriefcaseBusiness className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="Meslek seçin" />
                      </SelectTrigger>
                      <SelectContent align="start">
                        {occupations.map((occupation) => (
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
            <div className="mt-6 flex items-start gap-2 rounded-xl bg-muted/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              Bu ekran yalnızca arayüz demosudur. Girilen bilgiler sunucuya gönderilmez ve yalnızca bu sekmenin oturumunda saklanır.
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-end px-6 py-4 sm:px-8">
          <Button type="submit" form="personal-form" size="lg" className="h-11 min-w-36">
            Devam et <ArrowRight />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="border-b px-6 py-5">
            <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <DialogTitle className="text-lg">Güvenlik onayı</DialogTitle>
            <DialogDescription className="leading-relaxed">
              Telefonunuza gönderilen 6 haneli doğrulama kodunu girin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 px-6 py-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Tek kullanımlık şifre</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Demo kod: 123456</span>
            </div>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value)
                setOtpError("")
              }}
              onComplete={(value) => {
                setOtp(value)
                setSecurityOpen(false)
                setStep(2)
              }}
              containerClassName="justify-center"
              aria-invalid={!!otpError}
            >
              <InputOTPGroup className="gap-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <InputOTPSlot key={index} index={index} className="size-11 rounded-lg border text-base first:rounded-lg last:rounded-lg" />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {otpError && <p role="alert" className="text-center text-sm text-destructive">{otpError}</p>}
            <div className="flex gap-2 rounded-xl border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              Demo akışında herhangi bir 6 haneli kod ile ilerleyebilirsiniz.
            </div>
          </div>
          <DialogFooter className="m-0 justify-stretch rounded-none px-6 py-4 sm:justify-stretch">
            <Button onClick={verifyOtp} className="h-10 w-full">Kodu doğrula</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function HealthStep() {
  const healthAnswer = useQuoteStore((state) => state.healthAnswer)
  const setHealthAnswer = useQuoteStore((state) => state.setHealthAnswer)
  const setStep = useQuoteStore((state) => state.setStep)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HealthForm>({
    resolver: yupResolver(healthSchema),
    defaultValues: { answer: healthAnswer ?? undefined },
  })
  const answer = useWatch({ control, name: "answer" })

  const selectAnswer = (value: "yes" | "no") => {
    setValue("answer", value, { shouldValidate: true })
    setHealthAnswer(value)
  }

  return (
    <Card className="mx-auto w-full max-w-4xl border-0 shadow-xl shadow-slate-200/60 ring-1 ring-border/70">
      <CardHeader className="items-center gap-2 border-b px-6 pb-6 text-center sm:px-10">
        <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HeartPulse className="size-5" />
        </div>
        <CardTitle className="text-xl sm:text-2xl">Sağlık beyanınız</CardTitle>
        <CardDescription className="max-w-2xl text-balance leading-relaxed">
          Aşağıdaki rahatsızlıklardan biri için tanı aldınız veya tedavi gördünüz mü?
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-6 sm:px-10">
        <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {healthConditions.map((condition) => (
            <div key={condition} className="flex items-start gap-3 rounded-lg px-2 py-1.5 text-sm">
              <span className="mt-1.5 size-1.5 shrink-0 rotate-45 rounded-[1px] bg-primary" />
              <span className="leading-relaxed text-foreground/80">{condition}</span>
            </div>
          ))}
        </div>
        <Separator className="my-6" />
        <form
          id="health-form"
          onSubmit={handleSubmit(() => setStep(3))}
          className="space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => selectAnswer("yes")}
              aria-pressed={answer === "yes"}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                answer === "yes" && "border-primary bg-primary/[0.06] ring-1 ring-primary"
              )}
            >
              <span className={cn("flex size-6 items-center justify-center rounded-full border", answer === "yes" && "border-primary bg-primary text-primary-foreground")}>
                {answer === "yes" && <Check className="size-3.5" />}
              </span>
              Evet, tanı veya tedavi aldım
            </button>
            <button
              type="button"
              onClick={() => selectAnswer("no")}
              aria-pressed={answer === "no"}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                answer === "no" && "border-primary bg-primary/[0.06] ring-1 ring-primary"
              )}
            >
              <span className={cn("flex size-6 items-center justify-center rounded-full border", answer === "no" && "border-primary bg-primary text-primary-foreground")}>
                {answer === "no" && <Check className="size-3.5" />}
              </span>
              Hayır, tanı veya tedavi almadım
            </button>
          </div>
          {errors.answer && <p role="alert" className="text-sm text-destructive">{errors.answer.message}</p>}
        </form>
      </CardContent>
      <CardFooter className="justify-between px-6 py-4 sm:px-10">
        <Button variant="ghost" size="lg" onClick={() => setStep(1)}>
          <ArrowLeft /> Geri
        </Button>
        <Button type="submit" form="health-form" size="lg" className="h-11 min-w-36">
          Teklifi gör <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

const benefits = [
  ["Yatarak tedavi", "Limitsiz"],
  ["Ameliyat teminatı", "Limitsiz"],
  ["Anlaşmalı kurum", "600+ sağlık kuruluşu"],
  ["Bekleme süresi", "Yok"],
]

function QuoteStep() {
  const personal = useQuoteStore((state) => state.personal)
  const healthAnswer = useQuoteStore((state) => state.healthAnswer)
  const quoteSent = useQuoteStore((state) => state.quoteSent)
  const setQuoteSent = useQuoteStore((state) => state.setQuoteSent)
  const setStep = useQuoteStore((state) => state.setStep)

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-7 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-primary shadow-sm">
          <BadgeCheck className="size-3.5" /> Teklifiniz hazır
        </span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">İhtiyacınıza uygun sade bir plan</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Demo bilgileriniz kullanılarak örnek bir tamamlayıcı sağlık sigortası teklifi oluşturuldu.
        </p>
      </div>

      {quoteSent && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-medium">Teklif e-posta adresinize gönderildi.</p>
            <p className="mt-0.5 text-emerald-800/80">Demo bildirim: {personal.email}</p>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-0 shadow-xl shadow-slate-200/60 ring-1 ring-border/70">
          <CardHeader className="border-b px-6 pb-5 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription>Önerilen plan</CardDescription>
                <CardTitle className="mt-1 text-xl">Avantaj Tamamlayıcı Sağlık</CardTitle>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="size-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pt-6 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex gap-2">
                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">%10 Hoş geldin</span>
                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">%10 Peşin</span>
                </div>
                <p className="text-sm text-muted-foreground line-through">6.240,00 TL</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-primary">4.995,00 TL</p>
                <p className="mt-1 text-xs text-muted-foreground">Yıllık peşin ödeme</p>
              </div>
              <div className="rounded-xl bg-muted/70 px-4 py-3 text-right">
                <p className="text-xs text-muted-foreground">Aylık karşılığı</p>
                <p className="mt-0.5 font-semibold">416,25 TL</p>
              </div>
            </div>

            <Separator className="my-6" />
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-muted/20 p-3.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {label} <CircleHelp className="size-3.5" />
                  </div>
                  <p className="mt-1.5 text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-3 px-6 py-4 sm:px-8">
            <Button variant="outline" size="lg" onClick={() => setQuoteSent(true)}>
              <Send /> Teklifi gönder
            </Button>
            <Button size="lg" onClick={() => setQuoteSent(true)}>
              Satın alma demosu
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-fit bg-slate-950 text-white ring-0">
          <CardHeader>
            <CardTitle className="text-base text-white">Başvuru özeti</CardTitle>
            <CardDescription className="text-slate-400">Oturumda kayıtlı bilgiler</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">E-posta</p>
              <p className="mt-1 break-all text-sm text-slate-100">{personal.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Meslek</p>
              <p className="mt-1 text-sm text-slate-100">{personal.occupation}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Sağlık beyanı</p>
              <p className="mt-1 text-sm text-slate-100">
                {healthAnswer === "yes" ? "Tanı / tedavi mevcut" : "Tanı / tedavi yok"}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/8 p-3 text-xs leading-relaxed text-slate-300">
              <ShieldCheck className="size-4 shrink-0 text-fuchsia-300" />
              Sayfayı yenilediğinizde bu adım ve bilgiler korunur.
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant="ghost" className="mt-5" onClick={() => setStep(2)}>
        <ArrowLeft /> Sağlık beyanına dön
      </Button>
    </div>
  )
}

function FlowSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse space-y-8">
      <div className="h-20 rounded-2xl bg-muted" />
      <div className="mx-auto h-[420px] max-w-2xl rounded-xl bg-muted" />
    </div>
  )
}

export function InsuranceFlow() {
  const currentStep = useQuoteStore((state) => state.currentStep)
  const hasHydrated = useQuoteStore((state) => state.hasHydrated)
  const reset = useQuoteStore((state) => state.reset)
  const [flowKey, setFlowKey] = useState(0)

  useEffect(() => {
    void useQuoteStore.persist.rehydrate()
  }, [])

  if (!hasHydrated) {
    return <FlowSkeleton />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_oklch(0.95_0.03_330),_transparent_28%),linear-gradient(to_bottom,_white,_oklch(0.98_0.01_260))]">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="font-semibold leading-tight">Sağlığım Güvende</p>
              <p className="text-xs text-muted-foreground">Tamamlayıcı sağlık sigortası</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset()
              setFlowKey((key) => key + 1)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <RefreshCcw /> <span className="hidden sm:inline">Akışı sıfırla</span>
          </Button>
        </div>
      </header>

      <main className="px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Online teklif</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tamamlayıcı Sağlık Sigortası
          </h1>
        </div>
        <Stepper />
        <div key={flowKey} className="mx-auto mt-7 max-w-6xl sm:mt-9">
          {currentStep === 1 && <PersonalStep />}
          {currentStep === 2 && <HealthStep />}
          {currentStep === 3 && <QuoteStep />}
        </div>
      </main>

      <footer className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <span>© 2026 Sağlığım Güvende Demo</span>
        <span className="hidden sm:inline">Frontend sunumu · Gerçek teklif değildir</span>
      </footer>
    </div>
  )
}
