import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: JwtPayload) {
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
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
}
