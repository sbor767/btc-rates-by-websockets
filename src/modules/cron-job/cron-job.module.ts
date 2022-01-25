import { Module } from '@nestjs/common';
import { CryptocurrencyRateModule } from '../cryptocurrency-rate/cryptocurrency-rate.module';
import { CacheDbModule } from '../cache/cache-db.module';
import { CronJobService } from './services/cron-job.service';

@Module({
  imports: [CryptocurrencyRateModule, CacheDbModule],
  providers: [CronJobService],
})
export class CronJobModule {}
