import {FC} from "react";
import cn from "classnames";

import {Button, ButtonProps} from "../RootButton";
import ArrowIcon from "@/assets/svg/lined/arrow-right-simple.svg";

import css from "./style.module.css";

export const DefaultArrowButton: FC<Omit<ButtonProps, "rightContent">> = (
  props,
) => {
  const { children, className, ...other } = props;

  return (
    <Button
      className={cn(css.button, className)}
      rightContent={<ArrowIcon />}
      {...other}
    >
      {children}
    </Button>
  );
};
