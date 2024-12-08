import css from "./style.module.scss";
import { FC, HTMLProps } from "react";
import cn from "classnames";

export type SpinnerProps = HTMLProps<HTMLDivElement>;

export const Spinner: FC<SpinnerProps> = (props) => {
  const { className } = props;

  return <div className={cn(css.spinner, className)} {...props} />;
};
