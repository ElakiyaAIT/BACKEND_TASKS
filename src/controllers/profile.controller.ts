import {
  Controller,
  Get,
  UseGuards,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ProfileService } from '../services/profile.service';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

interface JwtUser {
  userId: string;
  email: string;
}
interface AuthenticatedRequest extends Request {
  user: JwtUser;
}
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@Request() req: AuthenticatedRequest) {
    try {
      return await this.profileService.getProfile(req.user.userId);
    } catch {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PROFILE_FETCH_FAILED,
      );
    }
  }
}
