import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';

// ✅ create typed extractor (fixes unsafe call warning)
const jwtExtractor = ExtractJwt.fromAuthHeaderAsBearerToken() as (
  req: Request,
) => string | null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: jwtExtractor,
      secretOrKey: 'SUPER_SECRET_KEY',
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(options);
  }

  validate(payload: { sub: string; email: string; roles: string[] }) {
    return payload;
  }
}
