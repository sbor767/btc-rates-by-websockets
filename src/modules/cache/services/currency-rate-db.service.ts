import {
  Injectable,
  Inject,
  CACHE_MANAGER,
  ConsoleLogger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CryptocurrencyRateResponse } from '../../cryptocurrency-rate/interfaces/cryptocurrency-rate-response.interface';

@Injectable()
export class CurrencyRateDbService {
  private readonly logger = new ConsoleLogger(CurrencyRateDbService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(rate: CryptocurrencyRateResponse): Promise<void> {
    await this.cacheManager.set('rate', rate);
  }

  async get(): Promise<CryptocurrencyRateResponse | undefined> {
    return this.cacheManager.get('rate');
  }
}
