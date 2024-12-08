"use client";

import {FormikHelpers, useFormik} from "formik";
import * as Yup from "yup";

export type FormState = {
  amount: string;
  currency: string | null;
};

const initialValues: FormState = {
  amount: "",
  currency: null,
};

export const useForm = (
  onSubmit: (values: FormState, helpers: FormikHelpers<FormState>) => void,
) =>
  useFormik<FormState>({
    initialValues,
    validationSchema: Yup.object({
      amount: Yup.number()
        .transform((value) => Number.isNaN(value) ? null : value )
        .required("Enter amount")
        .min(350, `Minimum amount to pay is 350 USD`)
        .max(9500, `Maximum amount to pay is 9 500 USD`),
      currency: Yup.string().required("Select currency"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit,
  });
