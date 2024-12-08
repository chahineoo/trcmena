import SuccessIcon from "@/assets/svg/lined/success.svg";
import SpinnerIcon from "@/assets/svg/lined/spinner.svg";
import WarningIcon from "@/assets/svg/lined/warning.svg";
import {PayoutStage} from "../../../types";

import css from "../style.module.scss";

type Stage = "processing" | "success" | "error";

export const getIcon = (stage: Stage) => {
  return stage === PayoutStage.processing ? (
    <SpinnerIcon className={css.spinner} />
  ) : stage === PayoutStage.success ? (
    <SuccessIcon />
  ) : (
    <WarningIcon />
  );
};

export const getTitle = (stage: Stage) => {
  return stage === PayoutStage.processing
    ? "Payment processing"
    : stage === PayoutStage.success
      ? "Payment successfully send"
      : "Payment not completed";
};

export const getText = (
  stage: Stage,
  name: string,
  amount: string,
  error: string | null,
) => {
  return stage === PayoutStage.processing
    ? `Your payment of ${amount} USD is being processed. It usually take under 5 minutes.`
    : stage === PayoutStage.success
      ? `Thank you of paying, ${name}, ${amount} USD to TRC Education Limited.`
      : (error ?? null);
};
