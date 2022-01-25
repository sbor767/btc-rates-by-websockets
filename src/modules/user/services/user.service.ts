import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserGateway } from '../gateways/user.gateway';
import { UserCacheDbService } from '../../cache/services/user-cache-db.service';
import { CurrencyRateDbService } from '../../cache/services/currency-rate-db.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userGateway: UserGateway,
    private readonly userCacheService: UserCacheDbService,
    private readonly currencyRateDbService: CurrencyRateDbService,
  ) {}

  async notifyUserForBtcRate(userId: string): Promise<void> | never {
    const session = await this.userCacheService.get(userId);
    if (!session) {
      throw new BadRequestException(
        `User session for user with id=${userId} not found`,
      );
    }

    const rate = await this.currencyRateDbService.get();
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
