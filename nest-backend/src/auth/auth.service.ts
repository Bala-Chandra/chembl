import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import type { Request } from 'express';

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
};

type RoleRow = {
  name: string;
};

type SessionRow = {
  id: string;
  user_id: number;
};

type JwtPayload = {
  sub: number;
  email: string;
  roles: string[];
};

/* ------------------------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------------------------ */

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/* ------------------------------------------------------------------ */
/* SERVICE */
/* ------------------------------------------------------------------ */

@Injectable()
export class AuthService {
  constructor(
    private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {}

  /* ------------------------------------------------------------------ */
  /* TOKEN GENERATION */
  /* ------------------------------------------------------------------ */

  generateTokens(user: { id: number; email: string; roles: string[] }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  /* ------------------------------------------------------------------ */
  /* VALIDATE USER */
  /* ------------------------------------------------------------------ */

  async validateUser(email: string, password: string) {
    const result = await this.pool.query<UserRow>(
      `
      SELECT id, email, password_hash
      FROM auth.users
      WHERE email = $1 AND is_active = true
      `,
      [email],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // roles
    const rolesRes = await this.pool.query<RoleRow>(
      `
      SELECT r.name
      FROM auth.roles r
      JOIN auth.user_roles ur ON ur.role_id = r.id
      WHERE ur.user_id = $1
      `,
      [user.id],
    );

    return {
      id: user.id,
      email: user.email,
      roles: rolesRes.rows.map((r) => r.name),
    };
  }

  /* ------------------------------------------------------------------ */
  /* LOGIN */
  /* ------------------------------------------------------------------ */

  async login(email: string, password: string, req: Request) {
    const user = await this.validateUser(email, password);

    const { accessToken, refreshToken } = this.generateTokens(user);

    const hashed = hashToken(refreshToken);

    await this.pool.query(
      `
      INSERT INTO auth.sessions (
        user_id,
        refresh_token_hash,
        user_agent,
        ip_address,
        expires_at
      )
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')
      `,
      [user.id, hashed, req.headers['user-agent'] ?? null, req.ip ?? null],
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  /* ------------------------------------------------------------------ */
  /* REFRESH TOKEN */
  /* ------------------------------------------------------------------ */

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const hashed = hashToken(refreshToken);

    // 1️⃣ validate session
    const sessionRes = await this.pool.query<SessionRow>(
      `
      SELECT id, user_id
      FROM auth.sessions
      WHERE refresh_token_hash = $1
        AND revoked = false
        AND expires_at > NOW()
      `,
      [hashed],
    );

    if (sessionRes.rows.length === 0) {
      throw new UnauthorizedException('Invalid session');
    }

    // 2️⃣ verify JWT safely
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };

    const { accessToken, refreshToken: newRefresh } = this.generateTokens(user);

    // 3️⃣ rotate refresh token
    await this.pool.query(
      `
      UPDATE auth.sessions
      SET refresh_token_hash = $1
      WHERE id = $2
      `,
      [hashToken(newRefresh), sessionRes.rows[0].id],
    );

    return {
      access_token: accessToken,
      refresh_token: newRefresh,
    };
  }

  /* ------------------------------------------------------------------ */
  /* LOGOUT */
  /* ------------------------------------------------------------------ */

  async logout(refreshToken: string) {
    if (!refreshToken) return;

    const hashed = hashToken(refreshToken);

    await this.pool.query(
      `
      UPDATE auth.sessions
      SET revoked = true
      WHERE refresh_token_hash = $1
      `,
      [hashed],
    );
  }
}
