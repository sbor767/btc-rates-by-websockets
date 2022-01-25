import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserIdDto } from '../dto/user-id.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('notify')
  @HttpCode(200)
  notifyCurrentRate(@Body() { userId }: UserIdDto) {
    return this.userService.notifyUserForBtcRate(userId.toString());
  }
}
