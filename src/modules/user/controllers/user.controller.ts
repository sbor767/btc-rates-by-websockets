import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserIdDto } from '../dto/user-id.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('notify')
  @HttpCode(200)
  async notifyCurrentRate(
    @Body() { userId }: UserIdDto,
  ): Promise<void | never> {
    if (!(await this.userService.userExist(userId))) {
      throw new UnauthorizedException('Unauthorized');
    }

    this.userService.notifyUserForBtcRate(userId);
  }
}
