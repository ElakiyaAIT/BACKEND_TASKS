import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_CONSTANTS } from 'src/common/constants/auth.constants';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.secret'), 
    });
  }

  async validate(payload: any) {
  try {
      // payload comes from decoded JWT
      if (!payload || !payload.sub) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD);
      }
      console.log('JWT Payload:', payload); // Debugging log
      // whatever you return here becomes req.user
      return {
        userId: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
}
