import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CryptocurrencyRateService } from './services/cryptocurrency-rate.service';

@Module({
  imports: [HttpModule],
  providers: [CryptocurrencyRateService],
  exports: [CryptocurrencyRateService],
})
export class CryptocurrencyRateModule {}
