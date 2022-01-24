import { Injectable, Logger } from '@nestjs/common';
import { UserGateway } from '../gateways/user.gateway';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

  constructor(private readonly userGateway: UserGateway) {}

  async userExist(userId: number): Promise<boolean> {
    return true;
  }

  async notifyUserForBtcRate(userId: number): Promise<void> {
    const rate = 1000;
    this.logger.log(`Current BTC rate for userId: ${userId} is ${rate}`);
    this.userGateway.notifyUserAboutRate(userId, rate);
  }
}
