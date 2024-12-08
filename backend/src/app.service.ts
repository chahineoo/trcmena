import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Configs, Environments } from './config/config.enum';
import { DatabaseService } from './modules/database/database.service';
import {
  CalculateFeeResponseDTO,
  PaymentResponseDTO,
} from './dto/responses.dto';
import { CreatePaymentDTO, GetPaymentDTO } from './dto/requests.dto';
import Decimal from 'decimal.js';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  AmountInfo,
  GuardarianCreateExchangeBody,
  GuardarianCurrency,
  GuardarianExchangeResponse,
} from './dto/guardarian-api.dto';
import { AppConfig, GuardarianConfig } from './config/configuration';
import { Payment } from '@prisma/client';

@Injectable()
export class AppService {
  private readonly axios: AxiosInstance;
  private readonly guardarianConfig: GuardarianConfig;
  private readonly appConfig: AppConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly database: DatabaseService,
  ) {
    this.appConfig = this.configService.get<AppConfig>(Configs.app);
    if (!Object.keys(Environments).includes(this.appConfig.nodeEnv)) {
      throw new Error(
        `${this.appConfig.nodeEnv} env is not supported. Did you mean ${Object.values(Environments)}?`,
      );
    }
    if (!this.appConfig.frontendUrl) {
      throw new Error('App config is required');
    }

    this.guardarianConfig = this.configService.get<GuardarianConfig>(
      Configs.guardarian,
    );
    if (
      !this.guardarianConfig.apiKey ||
      !this.guardarianConfig.baseUrl ||
      !this.guardarianConfig.payoutAddress ||
      !this.guardarianConfig.currencyTicker ||
      !this.guardarianConfig.currencyNetwork ||
      !this.guardarianConfig.currencyFiat ||
      (this.guardarianConfig.feePercentage < 0)
    ) {
      throw new Error('Guardarian config is required');
    }

    this.axios = axios.create({
      baseURL: this.guardarianConfig.baseUrl,
      headers: {
        'x-api-key': this.guardarianConfig.apiKey,
      },
    });

    this.guardarianConfig = {
      ...this.guardarianConfig,
      apiKey: '',
    };
  }

  async createPayment(body: CreatePaymentDTO): Promise<PaymentResponseDTO> {
    const fiatCurrencies = await this.getFiatCurrencies();
    if (
      !fiatCurrencies
        .map((currency) => currency.toLowerCase())
        .includes(body.currencyFrom.toLowerCase())
    ) {
      throw new BadRequestException(`Currency ${body.currencyFrom} not found`);
    }
    const amountInfo = this.getAmountWithFee(new Decimal(body.amount));
    const amountCrypto = await this.getEstimateByFiat(
      this.guardarianConfig.currencyFiat,
      amountInfo.amountWithFee,
      false,
    );
    const fromAmount = await this.getEstimateByFiat(
      body.currencyFrom,
      amountCrypto,
      true,
    );
    const timestamp = new Date();
    const exchange = await this.createExchange(
      {
        ...body,
        amount: Number(fromAmount.toFixed(2)),
      },
      timestamp.getTime(),
    );
    const result = await this.database.createPayment({
      exchangeId: String(exchange.id),
      clientName: body.clientName,
      payerName: body.payerName,
      passport: body.passport,
      birthDate: body.dateBirthday,
      email: body.email,
      amountFrom: exchange.amountFrom,
      amountTo: exchange.amountTo,
      originalAmount: new Decimal(body.amount),
      currencyFrom: exchange.currencyFrom,
      currencyTo: exchange.currencyTo,
      originalFee: amountInfo.fee,
      status: exchange.status,
      createdAt: timestamp,
      updatedAt: timestamp,
      redirectUrl: exchange.redirectUrl,
    });
    return {
      id: exchange.id,
      status: result.status,
      clientName: result.clientName,
      payerName: result.payerName,
      amount: result.originalAmount,
      fee: result.originalFee,
      createdAt: result.createdAt,
      redirectUrl: result.redirectUrl,
    };
  }

  async getPayment(dto: GetPaymentDTO): Promise<PaymentResponseDTO> {
    let payment: Payment;
    if (dto.id) {
      payment = await this.database.getPaymentByExchangeId(dto.id);
      if (!payment) {
        throw new NotFoundException(`Payment with id ${dto.id} not found`);
      }
    } else if (dto.timestamp) {
      payment = await this.database.getPaymentByTimestamp(dto.timestamp);
      if (!payment) {
        throw new NotFoundException(
          `Payment with timestamp ${dto.timestamp} not found`,
        );
      }
    }

    return {
      id: payment.exchangeId,
      status: payment.status,
      clientName: payment.clientName,
      payerName: payment.payerName,
      amount: payment.originalAmount,
      fee: payment.originalFee,
      createdAt: payment.createdAt,
      redirectUrl: payment.redirectUrl,
    };
  }

  calculateFee(amount: number): CalculateFeeResponseDTO {
    const amountInfo = this.getAmountWithFee(new Decimal(amount));
    return {
      amount: amountInfo.amountWithFee,
      percent: amountInfo.feePercent,
    };
  }

  private async getFiatCurrencies(): Promise<string[]> {
    const { data } =
      await this.axios.get<GuardarianCurrency[]>(`/v1/currencies/fiat`);
    return data
      .filter((currency) => currency.enabled)
      .map((currency) => currency.ticker);
  }

  private async getEstimateByFiat(
    currencyFiat: string,
    amount: Decimal,
    reversed: boolean,
  ): Promise<Decimal> {
    let params = {
      type: 'direct',
      from_currency: currencyFiat,
      to_currency: this.guardarianConfig.currencyTicker,
      to_network: this.guardarianConfig.currencyNetwork,
      from_amount: amount,
      fees_included: true,
    }
    if (reversed) {
      params['type'] = 'reverse';
      params['to_amount'] = amount;
      delete params['from_amount'];
    }
    const { data } = await this.axios.get(`/v1/estimate`, {
      params,
    });
    return new Decimal(data.value);
  }

  private getAmountWithFee(amount: Decimal): AmountInfo {
    const feePercent = new Decimal(this.guardarianConfig.feePercentage);
    const fee = amount.div(100).mul(feePercent);
    return {
      amount,
      fee,
      feePercent,
      amountWithFee: amount.plus(fee),
    };
  }

  private async createExchange(
    body: CreatePaymentDTO,
    created: number,
  ): Promise<GuardarianExchangeResponse> {
    const payload: GuardarianCreateExchangeBody = {
      from_amount: body.amount,
      from_currency: body.currencyFrom,
      to_currency: this.guardarianConfig.currencyTicker,
      from_network: null,
      to_network: this.guardarianConfig.currencyNetwork,
      redirects: {
        successful: `${this.appConfig.frontendUrl}?created=${created}`,
        cancelled: `${this.appConfig.frontendUrl}?created=${created}`,
        failed: `${this.appConfig.frontendUrl}?created=${created}`,
      },
      payout_info: {
        payout_address: this.guardarianConfig.payoutAddress,
        skip_choose_payout_address:
          this.guardarianConfig.skipChoosePayoutAddress,
      },
      customer: {
        contact_info: {
          email: body.email,
        },
      },
      deposit: {
        skip_choose_payment_category:
          this.guardarianConfig.skipChoosePaymentCategory,
      },
      locale: body.locale,
    };
    const { data } = await this.axios.post(`/v1/transaction`, payload);
    return {
      id: String(data.id),
      status: data.status,
      currencyFrom: data.from_currency_with_network,
      currencyTo: data.to_currency_with_network,
      amountFrom: new Decimal(data.from_amount || 0),
      amountTo: new Decimal(data.to_amount || 0),
      redirectUrl: data.redirect_url,
    };
  }
}
