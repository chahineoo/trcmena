'use client'

import {ChangeEvent, FC, HTMLProps, ReactNode, useState} from "react";
import cn from "classnames";

import CheckIcon from "@/assets/svg/lined/check.svg";

import css from "../style.module.scss";

export type InputProps = HTMLProps<HTMLInputElement> & {
  error?: boolean;
  success?: boolean;
  contentRight?: ReactNode;
  contentLeft?: ReactNode;
  variant?: "default";
};

export const Input: FC<InputProps> = (props) => {
  const {
    className,
    placeholder,
    error,
    success,
    contentRight,
    contentLeft,
    variant,
    onChange,
    ...other
  } = props;

  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    onChange?.(e);
  };

  return (
    <div
      className={cn(
        css.container,
        className,
        error && css.error,
        success && css.success,
        variant === "default" && css.default,
      )}
    >
      {contentLeft}
      <div className={css.inputWrapper}>
        <input
          className={cn(css.input, "text m")}
          placeholder={variant === "default" ? placeholder : ""}
          {...other}
          value={value}
          onChange={handleChange}
        />
        {placeholder && variant !== "default" && (
          <span className={cn(css.placeholder, "text m")}>
            {placeholder}
          </span>
        )}
      </div>
      {contentRight}
      {success && <CheckIcon className={css.checkIcon} />}
    </div>
  );
};
