import {FC, useEffect, useState} from "react";

import {apiClientBase} from "@/shared/lib/fetch";
import {getIcon, getText, getTitle} from "./helpers/getters";
import {PayoutStage, ProcessingDataType} from "../../types";
import CloseIcon from "@/assets/svg/lined/close.svg";

import css from "./style.module.scss";

export type ProcessingScreenProps = ProcessingDataType & {
  onGoBack: () => void;
};

export const ProcessingScreen: FC<ProcessingScreenProps> = (props) => {
  const { id, name, amount, stage, onGoBack } = props;

  const [status, setStatus] = useState(stage.status);
  const [error, setError] = useState<string | null>(stage?.message ?? null);

  const icon = getIcon(status);
  const title = getTitle(status);
  const text = getText(status, name, amount, error);

  useEffect(() => {
    if (stage.status !== PayoutStage.processing) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const { data } = await apiClientBase.get("/payment", {
          params: {
            id,
          },
        });

        switch (data.status) {
          case "finished":
            setStatus(PayoutStage.success);
            clearInterval(interval);
            break;
          case "failed":
            setStatus(PayoutStage.error);
            setError("Something went wrong.");
            clearInterval(interval);
            break;
          case "expired":
            setStatus(PayoutStage.error);
            setError("The validity period has expired");
            clearInterval(interval);
            break;
          case "cancelled":
            setStatus(PayoutStage.error);
            setError("Transaction has been cancelled");
            clearInterval(interval);
            break;
          case "refunded":
            setStatus(PayoutStage.error);
            setError("Returned due to the risk level");
            clearInterval(interval);
            break;
          default:
            setStatus(PayoutStage.processing);
        }
      } catch (error) {
        console.error(error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={css.container}>
      <button className={css.closeButton} onClick={onGoBack}>
        <CloseIcon />
      </button>
      {icon}
      <p className={css.title}>{title}</p>
      {text && <p className={css.text}>{text}</p>}
    </div>
  );
};
