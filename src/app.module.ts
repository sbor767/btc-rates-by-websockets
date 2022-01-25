import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './modules/user/user.module';
import { TimeScheduleModule } from './modules/time-schedule/time-schedule.module';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, TimeScheduleModule],
})
export class AppModule {}
