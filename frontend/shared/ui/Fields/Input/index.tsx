"use client";

import {ChangeEvent, FC, useMemo} from "react";
import {useField, useFormikContext} from "formik";

import {Input, InputProps} from "@/shared/ui/Input/ui/Input";
import {debounced} from "@/shared/lib/helpers/debounce";

export type InputFieldProps = InputProps & {
  name: string;
  debounce?: number;
};

export const InputField: FC<InputFieldProps> = (props) => {
  const { name, debounce, ...other } = props;

  const [field, meta, helpers] = useField({ name });
  const formik = useFormikContext();

  const handleBlur = () => {
    formik.validateField(name);
    void helpers.setTouched(true);
  };

  const handleKeyDown = () => {
    void helpers.setTouched(false);
  };

  const debouncedFuncOrNot = useMemo(
    () =>
      debounce
        ? debounced((e: ChangeEvent<HTMLInputElement>) => {
            field.onChange(e);
          }, debounce)
        : (e: ChangeEvent<HTMLInputElement>) => {
            field.onChange(e);
          },
    [debounce],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedFuncOrNot(e);
  };

  return (
    <Input
      {...other}
      {...field}
      onChange={handleChange}
      error={!!meta.error}
      success={field.value && !meta.error}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
};
