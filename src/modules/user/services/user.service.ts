import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserGateway } from '../gateways/user.gateway';
import { UserCacheDbService } from '../../cache/services/user-cache-db.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userGateway: UserGateway,
    private readonly userCacheService: UserCacheDbService,
  ) {}

  async notifyUserForBtcRate(userId: string): Promise<void> | never {
    const session = await this.userCacheService.get(userId);
    if (!session) {
      throw new BadRequestException(
        `User session for user with id=${userId} not found`,
      );
    }

    const rate = 1000;
    this.logger.log(`Current BTC rate for userId: ${userId} is ${rate}`);
    this.userGateway.notifyUserAboutRate(session, rate);
  }
}
