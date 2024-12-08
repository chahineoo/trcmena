"use client";

import { useField } from "formik";
import Select, { SelectProps } from "@/shared/ui/Select";

type a = Exclude<keyof SelectProps<unknown>, "value" | "onChange">;

export type SelectFieldProps<T> = Pick<SelectProps<T>, a> & {
  name: string;
};

export function SelectField<T extends Record<string, unknown>>(
  props: SelectFieldProps<T>,
) {
  const { name, ...other } = props;

  const [field, meta, helpers] = useField({ name });

  const handleChange = (value: string) => {
    void helpers.setValue(value);
  };

  return (
    <Select
      value={field.value}
      error={!!meta.error}
      {...other}
      onChange={handleChange}
    />
  );
}
