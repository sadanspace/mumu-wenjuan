import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { generatePasswordHash } from '../user/authUtils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      passwordHash: loadPasswordHash,
      salt,
      ...userInfo
    } = user.toObject();
    const passwordHash = generatePasswordHash(password, salt);
    if (passwordHash !== loadPasswordHash) {
      throw new UnauthorizedException('用户账户或密码错误');
    }

    const token = this.jwtService.sign(userInfo);
    return {
      userInfo,
      token: token,
    };
  }
}
