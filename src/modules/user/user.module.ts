import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserGateway } from './gateways/user.gateway';
import { UserService } from './services/user.service';
import { CacheDbModule } from '../cache/cache-db.module';
import { CryptocurrencyRateModule } from '../cryptocurrency-rate/cryptocurrency-rate.module';

@Module({
  imports: [CryptocurrencyRateModule, CacheDbModule],
  controllers: [UserController],
  providers: [UserGateway, UserService],
})
export class UserModule {}
