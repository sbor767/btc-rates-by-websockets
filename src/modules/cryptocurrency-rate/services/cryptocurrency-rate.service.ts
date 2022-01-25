import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom, map, Observable } from 'rxjs';
import {
  CRYPTOCURRENCY_API_BASE,
  CRYPTOCURRENCY_API_QUOTE,
  CRYPTOCURRENCY_API_URL,
} from '../constants/api.constants';
import { CryptocurrencyRateResponse } from '../interfaces/cryptocurrency-rate-response.interface';

@Injectable()
export class CryptocurrencyRateService {
  private readonly logger = new Logger(CryptocurrencyRateService.name);
  constructor(private httpService: HttpService) {}

  _get(): Observable<AxiosResponse<{ [CRYPTOCURRENCY_API_QUOTE]: string }>> {
    return this.httpService.get(
      `${CRYPTOCURRENCY_API_URL}data/price?fsym=${CRYPTOCURRENCY_API_BASE}&tsyms=${CRYPTOCURRENCY_API_QUOTE}`,
    );
  }

  async getRate(): Promise<CryptocurrencyRateResponse> {
    const source = this._get().pipe(map((response) => response.data));
    const { [CRYPTOCURRENCY_API_QUOTE]: btcUsd } = await lastValueFrom(source);
    this.logger.debug({ btcUsd });
    return {
      currencyBase: CRYPTOCURRENCY_API_BASE,
      currencyQuote: CRYPTOCURRENCY_API_QUOTE,
      rate: parseFloat(btcUsd),
    };
  }
}
