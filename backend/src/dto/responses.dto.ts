import Decimal from 'decimal.js';

export interface PaymentResponseDTO {
  id: string;
  status: string;
  clientName: string;
  payerName: string;
  amount: Decimal;
  fee: Decimal;
  createdAt: Date;
  redirectUrl: string;
}

export interface CalculateFeeResponseDTO {
  amount: Decimal;
  percent: Decimal;
}
