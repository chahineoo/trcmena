import Decimal from 'decimal.js';

export interface GuardarianExchangeResponse {
  id: string;
  status: TransactionStatuses;
  currencyFrom: string;
  currencyTo: string;
  amountFrom: Decimal;
  amountTo: Decimal;
  redirectUrl: string;
}

export enum Genders {
  M = 'M',
  F = 'F',
  O = 'O',
}

export enum TransactionStatuses {
  new = 'new',
  waitingForCustomer = 'waiting_for_customer',
  waitingForDeposit = 'waiting_for_deposit',
  exchanging = 'exchanging',
  onHold = 'on_hold',
  sending = 'sending',
  finished = 'finished',
  failed = 'failed',
  expired = 'expired',
  cancelled = 'cancelled',
  refuned = 'refunded',
}

export interface GuardarianCreateExchangeBody {
  from_amount: number;
  from_currency: string;
  to_currency: string;
  from_network: string | null;
  to_network: string | null;
  kyc_shared_token?: string;
  kyc_shared_token_provider?: string;
  redirects: {
    successful?: string;
    cancelled?: string;
    failed?: string;
  };
  payout_info: {
    payout_address: string;
    extra_id?: string;
    skip_choose_payout_address: boolean;
  };
  customer: {
    contact_info: {
      email?: string;
    };
    billing_info?: {
      country_alpha_2?: string;
      us_region_alpha_2?: string;
      region?: string;
      city?: string;
      street_address?: string;
      apt_number?: string;
      post_index?: string;
      first_name?: string;
      last_name?: string;
      date_of_birthday?: string;
      gender?: Genders;
    };
  };
  deposit?: {
    payment_category?: string;
    skip_choose_payment_category?: boolean;
  };
  customer_country?: string;
  external_partner_link_id?: string;
  locale: string;
}

export interface GuardarianPaymentMethod {
  type: string;
  payment_category: string;
  deposit_enabled: boolean;
  withdrawal_enabled: boolean;
}

export interface GuardarianNetwork {
  name: string;
  network: string;
  block_explorer_url_mask: string | null;
  token_contract: string | null;
  logo_url: string;
  payment_methods: GuardarianPaymentMethod[];
  enabled_subscription: boolean;
  network_fee: string | null;
}

export interface GuardarianCurrency {
  id: string;
  currency_type: string;
  ticker: string;
  name: string;
  enabled: boolean;
  has_external_id: boolean;
  is_featured: boolean | null;
  is_stable: boolean | null;
  is_available: boolean | null;
  enabled_subscription: boolean;
  payment_methods: GuardarianPaymentMethod[];
  block_explorer_url_mask: boolean | null;
  default_exchange_value: string;
  networks: GuardarianNetwork[];
}

export interface GuardarianCurrencyResponse {
  symbol: string;
  name: string;
  paymentMethods: string[];
}

export interface AmountInfo {
  amount: Decimal;
  feePercent: Decimal;
  fee: Decimal;
  amountWithFee: Decimal;
}
