import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from '../schemas/user.schema';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // ---------------- REGISTER ----------------
  async register(dto: RegisterDto) {
    // 1. Check if user exists
   
try{
 const userExists = await this.userModel.findOne({ email: dto.email });
    if (userExists) {
      throw new BadRequestException('Email already registered');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Save user
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      userId: user._id,
    };
  } catch(error){
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Registration failed');
  }
}
  // ---------------- LOGIN ----------------
  async login(dto: LoginDto) {
    // 1. Find user
    try{
      const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Create JWT payload
    const payload = {
      sub: user._id,
      email: user.email,
    };

    // 4. Sign token
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
    } catch(error){
       if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(ERROR_MESSAGES.LOGIN_FAILED);
    }
  }
}
