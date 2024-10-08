import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserReq } from './dto/CreateUserReq.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserReq: CreateUserReq) {
    return await this.userService.createUser(createUserReq);
  }

  @Get('info')
  @Redirect('/api/auth/profile', 302) //Get临时
  async getUserInfo() {
    return;
  }

  @Public()
  @Post('login')
  @Redirect('/api/auth/login', 307) //POST临时
  async login() {
    return;
  }
}
