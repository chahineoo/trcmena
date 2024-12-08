import { FC } from "react";

import { apiClientBase } from "@/shared/lib/fetch";
import { ProcessingDataType } from "../../types";
import { PaymentWidgetContent } from "../PaymentWidgetContent";
import { mapPaymentStatus } from "../../helpers/mapPaymentStatus";

import css from "./style.module.scss";

export type PaymentWidgetProps = {
  paymentId?: string;
};

export const PaymentWidget: FC<PaymentWidgetProps> = async (props) => {
  const { paymentId } = props;

  let processingData: ProcessingDataType | undefined;

  if (paymentId) {
    try {
      const { data } = await apiClientBase.get("/payment", {
        params: {
          timestamp: paymentId,
        },
      });

      processingData = {
        id: data.id,
        name: data.clientName,
        amount: data.amount,
        stage: mapPaymentStatus(data.status),
      };
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={css.card}>
      <PaymentWidgetContent initialProcessingData={processingData} />
    </div>
  );
};
