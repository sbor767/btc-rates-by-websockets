import { Injectable, Logger } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { CurrencyRateDbService } from '../../cache/services/currency-rate-db.service';
import { CryptocurrencyRateService } from '../../cryptocurrency-rate/services/cryptocurrency-rate.service';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);
  constructor(
    private readonly cryptocurrencyRateService: CryptocurrencyRateService,
    private readonly currencyRateDbService: CurrencyRateDbService,
  ) {}

  async setRateToDb() {
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

  @Timeout(0)
  handleOnceOnStart(): Promise<void> {
    this.logger.debug('handleOnceOnStart()');
    return this.setRateToDb();
  }

  @Interval(2 * 60 * 1000)
  handleEachTwoMinutes(): Promise<void> {
    this.logger.debug('handleEachTwoMinutes - Called each 2 minutes');
    return this.setRateToDb();
  }
}
