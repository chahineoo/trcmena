import { Injectable } from '@nestjs/common';
import { Payment, PrismaClient } from '@prisma/client';
import { TransactionStatuses } from '../../dto/guardarian-api.dto';

@Injectable()
export class DatabaseService extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }

  async createPayment(payload: Payment): Promise<Payment> {
    return this.payment.create({
      data: {
        ...payload,
      },
    });
  }

  async getPaymentByExchangeId(exchangeId: string): Promise<Payment> {
    return this.payment.findUnique({
      where: { exchangeId: exchangeId },
    });
  }

  async getPaymentByTimestamp(timestamp: number): Promise<Payment> {
    return this.payment.findFirst({
      where: { createdAt: new Date(timestamp) },
    });
  }

  async updatePaymentById(
    id: string,
    payload: Partial<Payment>,
  ): Promise<Payment> {
    return this.payment.update({
      where: {
        exchangeId: id,
      },
      data: payload,
    });
  }

  async getPendingPayments(): Promise<
    Pick<Payment, 'exchangeId' | 'status' | 'amountFrom' | 'amountTo'>[]
  > {
    return this.payment.findMany({
      where: {
        status: {
          in: [
            TransactionStatuses.new,
            TransactionStatuses.onHold,
            TransactionStatuses.sending,
            TransactionStatuses.waitingForCustomer,
            TransactionStatuses.waitingForDeposit,
            TransactionStatuses.exchanging,
          ],
        },
      },
      select: {
        exchangeId: true,
        status: true,
        amountFrom: true,
        amountTo: true,
      },
    });
  }
}
