import * as yup from "yup"

import type { HealthForm } from "./types"

export const healthSchema: yup.ObjectSchema<HealthForm> = yup.object({
  answer: yup
    .mixed<HealthForm["answer"]>()
    .oneOf(["yes", "no"], "Devam etmek için bir seçim yapın.")
    .required("Devam etmek için bir seçim yapın."),
})
