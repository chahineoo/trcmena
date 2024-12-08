import { FormikErrors } from "formik";

export const getFormikErrorMessage = <T>(
  formikErrors: FormikErrors<T>,
): string | null => {
  const errors = Object.values(formikErrors) as string[];

  return errors.length
    ? errors.length > 1
      ? `${errors[0]} and ${errors.length - 1} more errors`
      : errors[0]
    : null;
};
