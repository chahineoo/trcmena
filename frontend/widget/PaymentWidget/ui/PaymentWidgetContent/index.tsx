"use client";

import {FC, useRef, useState} from "react";

import {SecondScreen} from "../SecondScreen";
import {FirstScreen} from "../FirstScreen";
import {ProcessingScreen} from "../ProcessingScreen";
import {FormState} from "@/widget/PaymentWidget/ui/FirstScreen/hooks/useForm";
import {useScreen} from "@/widget/PaymentWidget/hooks/useScreen/useScreen";
import {apiClientBase} from "@/shared/lib/fetch";
import {ProcessingDataType, ScreensType} from "@/widget/PaymentWidget/types";
import {mapPaymentStatus} from "@/widget/PaymentWidget/helpers/mapPaymentStatus";
import {useRouter} from "next/navigation";

export type PaymentWidgetProps = {
  initialProcessingData?: ProcessingDataType;
};

export const PaymentWidgetContent: FC<PaymentWidgetProps> = (props) => {
  const { initialProcessingData } = props;

  const router = useRouter();

  const [processingData, setProcessingData] =
    useState<ProcessingDataType | null>(initialProcessingData ?? null);
  const formData = useRef<FormState | null>(null);

  const { list, goTo, goToStart } = useScreen<ScreensType>([
    FirstScreen,
    { onSuccess: handleSuccess },
  ]);

  const onSubmitPayment = async (amount: string, currency: string) => {
    if (!formData.current) {
      return;
    }

    try {
      const { data } = await apiClientBase.post("/payment", {
        amount: Number(amount),
        email: formData.current.email,
        clientName: formData.current.studentName,
        payerName: formData.current.payerName,
        passport: formData.current.passport,
        dateBirthday: formData.current.birth,
        currencyFrom: currency,
      });

      setProcessingData({
        id: data.id,
        name: formData.current.studentName,
        amount,
        stage: mapPaymentStatus(data.status),
      });

      window.location.href = data.redirectUrl;
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackButtonClick = () => {
    goToStart();
    setProcessingData(null);
    formData.current = null;

    router.replace(window.location.pathname, undefined);
  };

  function handleSuccess(values: FormState) {
    formData.current = values;

    goTo([SecondScreen, { onSuccess: onSubmitPayment }]);
  }

  return (
    <>
      {processingData ? (
        <ProcessingScreen
          {...processingData}
          onGoBack={handleBackButtonClick}
        />
      ) : (
        <>
          <h2>Pay student&#39;s fees</h2>
          {list}
        </>
      )}
    </>
  );
};
