import {
  Injectable,
  Inject,
  CACHE_MANAGER,
  ConsoleLogger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class UserCacheDbService {
  private readonly logger = new ConsoleLogger(UserCacheDbService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(userId: string, clientSession: string): Promise<void> {
    await this.cacheManager.set(userId, clientSession);
  }

  async get(userId: string): Promise<string | undefined> {
    return this.cacheManager.get(userId);
  }

  async delete(clientSession: string): Promise<void> {
    const keys = await this.cacheManager.store.keys();
    for (const key of keys) {
      if ((await this.get(key)) === clientSession) {
        await this.cacheManager.del(key);
        this.logger.debug(
          `Deleted session: ${clientSession} for user with id=${key}`,
        );
        return;
      }
    }
  }
}
