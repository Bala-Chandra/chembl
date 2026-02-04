import { Body, Controller, Post, Res, Get, Query } from '@nestjs/common';
import type { Response } from 'express';
import { SearchService } from './search.service';
import type { SearchCategory } from './types/search.types';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('session')
  async createSession(
    @Body() body: { value: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { sessionId } = await this.searchService.createSearchSession(
      body.value,
    );

    res.cookie('chembl_search_sid', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true in production
      maxAge: 10 * 60 * 1000,
    });

    return { ok: true };
  }

  @Get('autocomplete')
  async autocomplete(
    @Query('category') category: SearchCategory,
    @Query('q') query: string,
  ) {
    if (!query || query.length < 3) {
      return [];
    }

    switch (category) {
      case 'structure':
        return await this.searchService.autocompleteStructure(query);

      case 'target':
        return await this.searchService.autocompleteTarget(query);

      case 'assay':
        return await this.searchService.autocompleteAssay(query);

      default:
        return [];
    }
  }
}
