import * as yup from "yup"

import type { PersonalDetails } from "../../types"

export const personalDetailsSchema: yup.ObjectSchema<PersonalDetails> =
  yup.object({
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
