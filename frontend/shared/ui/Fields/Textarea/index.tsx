"use client";

import { FC } from "react";
import { useField, useFormikContext } from "formik";
import { Textarea, TextareaProps } from "@/shared/ui/Input/ui/Textarea";

export type TextareaFieldProps = TextareaProps & {
  name: string;
};

export const TextareaField: FC<TextareaFieldProps> = (props) => {
  const { name, ...other } = props;

  const [field, meta, helpers] = useField({ name });
  const formik = useFormikContext();

  const handleBlur = () => {
    formik.validateField(name);
    void helpers.setTouched(true);
  };

  const handleKeyDown = () => {
    void helpers.setTouched(false);
  };

  return (
    <Textarea
      {...other}
      {...field}
      error={!!meta.error}
      success={field.value && !meta.error}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
};
