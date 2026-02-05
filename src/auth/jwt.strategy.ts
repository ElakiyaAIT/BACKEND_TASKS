import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_CONSTANTS } from 'src/common/constants/auth.constants';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AUTH_CONSTANTS.JWT_SECRET, 
    });
  }

  async validate(payload: any) {
  try {
      // payload comes from decoded JWT
      if (!payload || !payload.sub) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD);
      }

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
