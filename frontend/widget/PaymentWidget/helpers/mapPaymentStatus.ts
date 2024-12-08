import { PayoutStage, StatusFromApi } from "@/widget/PaymentWidget/types";

export const mapPaymentStatus = (
  status: StatusFromApi,
): { status: PayoutStage; message?: string } => {
  switch (status) {
    case "finished":
      return { status: PayoutStage.success };
    case "failed":
      return { status: PayoutStage.error, message: "Something went wrong." };
    case "expired":
      return {
        status: PayoutStage.error,
        message: "The validity period has expired",
      };
    case "cancelled":
      return {
        status: PayoutStage.error,
        message: "Transaction has been cancelled",
      };
    case "refunded":
      return {
        status: PayoutStage.error,
        message: "Returned due to the risk level",
      };
    default:
      return {
        status: PayoutStage.processing,
      };
  }
};
