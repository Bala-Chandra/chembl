import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Post('session')
  async createSession(
    @Body() body: { value: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { sessionId } = await this.service.createSearchSession(body.value);

    res.cookie('chembl_search_sid', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true in production
      maxAge: 10 * 60 * 1000,
    });

    return { ok: true };
  }
}
