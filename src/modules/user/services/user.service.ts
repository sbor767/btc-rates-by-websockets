import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserGateway } from '../gateways/user.gateway';
import { UserCacheDbService } from '../../cache/services/user-cache-db.service';
import { CryptocurrencyRateService } from '../../cryptocurrency-rate/services/cryptocurrency-rate.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userGateway: UserGateway,
    private readonly cryptocurrencyRateService: CryptocurrencyRateService,
    private readonly userCacheService: UserCacheDbService,
  ) {}

  async notifyUserForBtcRate(userId: string): Promise<void> | never {
    const session = await this.userCacheService.get(userId);
    if (!session) {
      throw new BadRequestException(
        `User session for user with id=${userId} not found`,
      );
    }

    const rate = await this.cryptocurrencyRateService.getRate();
    this.logger.log(
      `Current BTC rate for userId: ${userId} is ${JSON.stringify(
        rate,
        null,
        2,
      )}`,
    );
    this.userGateway.notifyUserAboutRate(session, rate);
  }
}
