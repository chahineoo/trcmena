import { Environments } from './config.enum';

export interface GuardarianConfig {
  baseUrl: string;
  apiKey: string;
  currencyTicker: string;
  currencyNetwork: string;
  currencyFiat: string;
  payoutAddress: string;
  skipChoosePayoutAddress: boolean;
  skipChoosePaymentCategory: boolean;
  feePercentage: number;
}

export interface AppConfig {
  port: number;
  requestLimit: number;
  nodeEnv: string;
  frontendUrl: string;
  corsOrigin: string | string[];
}

export interface GlobalConfig {
  guardarian: GuardarianConfig;
  app: AppConfig;
}

export default (): GlobalConfig => ({
  guardarian: {
    baseUrl: process.env.GUARDARIAN_BASE_URL || '',
    apiKey: process.env.GUARDARIAN_API_KEY || '',
    currencyTicker: process.env.GUARDARIAN_CURRENCY_TICKER || '',
    currencyNetwork: process.env.GUARDARIAN_CURRENCY_NETWORK || '',
    currencyFiat: process.env.GUARDARIAN_FIAT_CURRENCY || '',
    payoutAddress: process.env.GUARDARIAN_PAYOUT_ADDRESS || '',
    skipChoosePayoutAddress:
      process.env.GUARDARIAN_SKIP_CHOOSE_PAYOUT_ADDRESS === 'false'
        ? false
        : true,
    skipChoosePaymentCategory:
      process.env.GUARDARIAN_SKIP_CHOOSE_PAYMENT_CATEGORY === 'true'
        ? true
        : false,
    feePercentage: +process.env.GUARDARIAN_FEE_PERCENTAGE,
  },
  app: {
    port: +process.env.APP_PORT || 3000,
    requestLimit: +process.env.APP_REQUEST_LIMIT || 1,
    frontendUrl: process.env.FRONTEND_BASE_URL || '',
    nodeEnv: process.env.NODE_ENV || Environments.development,
    corsOrigin: process.env.APP_CORS_ORIGIN?.split(',') || '*',
  },
});
