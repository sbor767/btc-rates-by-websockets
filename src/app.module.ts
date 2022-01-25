import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './modules/user/user.module';
import { CronJobModule } from './modules/cron-job/cron-job.module';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, CronJobModule],
})
export class AppModule {}
