import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserGateway } from './gateways/user.gateway';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  providers: [UserGateway, UserService],
})
export class UserModule {}
