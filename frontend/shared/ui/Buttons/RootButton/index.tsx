import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import css from "./style.module.scss";
import cn from "classnames";
import { Spinner } from "@/shared/ui";

export type ButtonProps = {
  styleType?: "default" | "light" | "blank";
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  contentClassName?: string;
  children?: ReactNode;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = (props) => {
  const {
    children,
    rightContent,
    leftContent,
    className,
    isLoading,
    ...other
  } = props;

  return (
    <button
      className={cn(css.button, className, isLoading && css.isLoading)}
      {...other}
    >
      {isLoading ? (
        <div className={css.loader}>
          <Spinner
            style={{
              borderColor: "white",
              borderWidth: "3px",
              width: "22px",
              height: "22px",
            }}
          />
        </div>
      ) : null}
      {leftContent}
      {children}
      {rightContent}
    </button>
  );
};
