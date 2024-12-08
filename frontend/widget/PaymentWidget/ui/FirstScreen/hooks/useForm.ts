"use client";

import {FormikHelpers, useFormik} from "formik";
import * as Yup from "yup";

export type FormState = {
  payerName: string;
  studentName: string;
  passport: string;
  birth: string;
  email: string;
};

const initialValues: FormState = {
  payerName: "",
  studentName: "",
  passport: "",
  birth: "",
  email: "",
};

export const useForm = (
  onSubmit: (values: FormState, helpers: FormikHelpers<FormState>) => void,
) =>
  useFormik<FormState>({
    initialValues,
    validationSchema: Yup.object({
      payerName: Yup.string()
        .trim("Payer name cannot include leading and trailing spaces")
        .strict(true)
        .matches(
          /^[a-z A-Z]+$/,
          "Payer name must contain only letters of the English alphabet",
        )
        .required("Enter name"),
      studentName: Yup.string()
        .trim("Student name cannot include leading and trailing spaces")
        .strict(true)
        .matches(
          /^[a-z A-Z]+$/,
          "Student name must contain only letters of the English alphabet",
        )
        .required("Enter name"),
      passport: Yup.string()
        .trim("Passport cannot include leading and trailing spaces")
        .strict(true)
        .test(
          "is-correct-passport",
          `Passport must contain at least one digit`,
          (value) =>
            new RegExp(
              /\d/
            ).test(value ?? ''),
        )
        .required("Enter passport number"),
      email: Yup.string()
        .trim("Email cannot include leading and trailing spaces")
        .strict(true)
        .email("Entered email is invalid")
        .required("Enter email"),
      birth: Yup.string()
        .required("Enter birth date")
        .test(
          "is-correct-birth-date",
          `Enter the date in the following format MM.DD.YYYY`,
          (value) =>
            new RegExp(
              /^(0[1-9]|[1-9]|1[012])[.](0[1-9]|[1-9]|1[0-9]|2[0-9]|3[01])[.](19(\d\d)|20(\d\d))$/,
              "gm",
            ).test(value),
        )
        .test(
          "is-correct-birth-date-2",
          "Your date of birth may not be in the future",
          (value) => {
            const [month, day, year] = value.split(".");
            const inputDay = new Date(`${year}-${month}-${day}`).getTime();
            const nowDay = new Date().getTime();

            return inputDay < nowDay;
          },
        ),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit,
  });
