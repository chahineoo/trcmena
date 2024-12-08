import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { Configs } from '../config/config.enum';
import { GuardarianExchangeResponse } from '../dto/guardarian-api.dto';
import { DatabaseService } from '../modules/database/database.service';

@Injectable()
export class TasksService {
  private isSyncStatusesIsWork: boolean;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {
    this.isSyncStatusesIsWork = false;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncStatuses(): Promise<boolean> {
    try {
      Logger.debug(`[${this.syncStatuses.name}]: Task has been started`);
      if (this.isSyncStatusesIsWork) {
        Logger.debug(
          `[${this.syncStatuses.name}]: Already working, next task will start at next minute`,
        );
        return false;
      }
      this.isSyncStatusesIsWork = true;

      let count = 0;
      const updatedRows = [];
      const transactionsDb = await this.databaseService.getPendingPayments();
      const promises = transactionsDb.map((transaction) => {
        return new Promise((resolve, reject) => {
          (async () => {
            try {
              const { data: txInfo } =
                await axios.get<GuardarianExchangeResponse>(
                  `${this.configService.get(Configs.guardarian).baseUrl}/v1/transaction/${Number(transaction.exchangeId)}`,
                  {
                    headers: {
                      'x-api-key': this.configService.get(Configs.guardarian)
                        .apiKey,
                    },
                  },
                );
              const payment = await this.databaseService.updatePaymentById(
                txInfo.id,
                {
                  status: txInfo.status,
                  amountFrom: txInfo.amountFrom,
                  amountTo: txInfo.amountTo,
                },
              );
              updatedRows.push({
                exchangeId: payment.exchangeId,
                status: payment.status,
                amountFrom: payment.amountFrom,
                amountTo: payment.amountTo,
              });
              count++;
              resolve(true);
            } catch (error) {
              reject(error);
            }
          })();
        });
      });
      await Promise.all(promises);
      Logger.debug(`[${this.syncStatuses.name}]: Task successful finished`);
      Logger.debug(`Updated ${count} rows:`, updatedRows);

      this.isSyncStatusesIsWork = false;
      return true;
    } catch (error) {
      Logger.debug(`[${this.syncStatuses.name}]: Task failed:`);
      Logger.error(error);
      this.isSyncStatusesIsWork = false;
    }
  }
}
