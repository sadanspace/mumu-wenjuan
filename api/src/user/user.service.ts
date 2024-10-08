import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserReq } from './dto/CreateUserReq.dto';
import { generatePasswordHash, generateSalt } from './authUtils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(userData: CreateUserReq) {
    const { username, password, nickname } = userData;

    const salt = generateSalt();
    const passwordHash = generatePasswordHash(password, salt);

    const createdUser = new this.userModel({
      username,
      nickname,
      passwordHash,
      salt,
    });
    return await createdUser.save();
  }

  async findOne(username: string) {
    return await this.userModel.findOne({ username });
  }
}
