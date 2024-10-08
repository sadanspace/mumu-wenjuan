import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserReq } from '../user/dto/LoginUserReq.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() user: CreateUserReq) {
    return this.authService.signIn(user.username, user.password);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
