import { FirstScreenProps } from "@/widget/PaymentWidget/ui/FirstScreen";
import { SecondScreenProps } from "@/widget/PaymentWidget/ui/SecondScreen";

export type ScreensType = FirstScreenProps | SecondScreenProps;

export enum PayoutStage {
  processing = "processing",
  success = "success",
  error = "error",
}

export type ProcessingDataType = {
  id: string;
  name: string;
  amount: string;
  stage: { status: PayoutStage; message?: string };
};

export type StatusFromApi =
  | "new"
  | "waiting_for_customer"
  | "waiting_for_deposit"
  | "exchanging"
  | "on_hold"
  | "sending"
  | "finished"
  | "failed"
  | "expired"
  | "cancelled"
  | "refunded";
