import {FC, HTMLProps} from "react";
import cn from "classnames";

import css from "../style.module.scss";
import textareaCss from "./style.module.scss";
import CheckIcon from "@/assets/svg/lined/check.svg";

export type TextareaProps = HTMLProps<HTMLTextAreaElement> & {
  error?: boolean;
  success?: boolean;
};

export const Textarea: FC<TextareaProps> = (props) => {
  const { className, placeholder, error, success, ...other } = props;

  return (
    <div
      className={cn(
        css.container,
        css.input,
        textareaCss.container,
        error && css.error
      )}
    >
      <textarea
        className={cn("text m", textareaCss.textarea, className)}
        placeholder={""}
        {...other}
      />
      {placeholder && (
        <span
          className={cn(css.placeholder, textareaCss.placeholder, "text m")}
        >
          {placeholder}
        </span>
      )}
      {success && <CheckIcon className={css.checkIcon} />}
    </div>
  );
};
