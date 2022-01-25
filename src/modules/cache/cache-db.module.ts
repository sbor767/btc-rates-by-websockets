import { CacheModule, Module } from '@nestjs/common';
import { CurrencyRateDbService } from './services/currency-rate-db.service';
import { UserCacheDbService } from './services/user-cache-db.service';

@Module({
  imports: [CacheModule.register({ ttl: 0 })],
  providers: [UserCacheDbService, CurrencyRateDbService],
  exports: [UserCacheDbService, CurrencyRateDbService],
})
export class CacheDbModule {}
