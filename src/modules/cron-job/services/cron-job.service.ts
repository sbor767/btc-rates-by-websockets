import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CurrencyRateDbService } from '../../cache/services/currency-rate-db.service';
import { CryptocurrencyRateService } from '../../cryptocurrency-rate/services/cryptocurrency-rate.service';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);
  constructor(
    private readonly cryptocurrencyRateService: CryptocurrencyRateService,
    private readonly currencyRateDbService: CurrencyRateDbService,
  ) {}

  @Cron('0 */2 * * * *')
  async handleCheckForCryptocurrencyRate(): Promise<void> {
    this.logger.debug(
      'handleCheckForAllConfirmedPaymentsCron - Called every 2 minutes',
    );
    const rate = await this.cryptocurrencyRateService.getRate();
    await this.currencyRateDbService.set(rate);
    this.logger.debug(
      `Set rate to db as ${JSON.stringify(
        await this.currencyRateDbService.get(),
        null,
        2,
      )}`,
    );
  }
}
