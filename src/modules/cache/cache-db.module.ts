import { CacheModule, Module } from '@nestjs/common';
import { UserCacheDbService } from './services/user-cache-db.service';

@Module({
  imports: [CacheModule.register({ ttl: 0 })],
  providers: [UserCacheDbService],
  exports: [UserCacheDbService],
})
export class CacheDbModule {}
