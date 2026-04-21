import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
};

type RoleRow = {
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ ADD THIS BACK
  async validateUser(email: string, password: string) {
    const sql = `
      SELECT u.id, u.email, u.password_hash
      FROM auth.users u
      WHERE u.email = $1 AND u.is_active = true
    `;

    const result = await this.pool.query<UserRow>(sql, [email]);

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🔹 Fetch roles
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

  // ✅ LOGIN (uses validateUser)
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }
}
