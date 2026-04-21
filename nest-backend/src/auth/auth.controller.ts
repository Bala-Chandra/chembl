import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

type RequestWithCookies = Request & {
  cookies: {
    refresh_token?: string;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* ---------------- LOGIN ---------------- */
  @Post('login')
  async login(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { email: string; password: string },
  ) {
    const result = await this.authService.login(body.email, body.password, req);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  /* ---------------- REFRESH ---------------- */
  @Post('refresh')
  async refresh(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    const result = await this.authService.refresh(refreshToken);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      access_token: result.access_token,
    };
  }

  /* ---------------- LOGOUT ---------------- */
  @Post('logout')
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }
}
