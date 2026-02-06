import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { SearchService } from './search.service';
import type {
  SearchCategory,
  SearchCounts,
  AutocompleteItem,
} from './types/search.types';

const VALID_CATEGORIES: SearchCategory[] = [
  'structure',
  'target',
  'assay',
  'reference',
];

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // ------------------------------------------------------------------
  // CREATE SEARCH SESSION
  // ------------------------------------------------------------------
  @Post('session')
  async createSession(
    @Body() body: { category: SearchCategory; value: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { sessionId } = await this.searchService.createSearchSession(
      body.category,
      body.value,
    );

    res.cookie('chembl_search_sid', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 10 * 60 * 1000,
    });

    return { ok: true };
  }

  // ------------------------------------------------------------------
  // COUNTS
  // ------------------------------------------------------------------

  @Get('counts/default')
  async defaultCounts(): Promise<SearchCounts> {
    return this.searchService.getDefaultCounts();
  }

  @Post('counts')
  async counts(
    @Body() body: { category: string; value: string },
  ): Promise<SearchCounts> {
    if (!VALID_CATEGORIES.includes(body.category as SearchCategory)) {
      throw new BadRequestException('Invalid search category');
    }

    return this.searchService.getCounts(
      body.category as SearchCategory,
      body.value,
    );
  }

  // ------------------------------------------------------------------
  // AUTOCOMPLETE  ✅ FIX IS HERE
  // ------------------------------------------------------------------
  @Get('autocomplete')
  async autocomplete(
    @Query('category') category: SearchCategory,
    @Query('q') query: string,
  ): Promise<AutocompleteItem[]> {
    if (!query || query.length < 3 || !category) {
      return [];
    }

    switch (category) {
      case 'structure':
        return this.searchService.autocompleteStructure(query);

      case 'target':
        return this.searchService.autocompleteTarget(query);

      case 'assay':
        return this.searchService.autocompleteAssay(query);

      case 'reference':
        return this.searchService.autocompleteReference(query);

      default:
        return [];
    }
  }
}
