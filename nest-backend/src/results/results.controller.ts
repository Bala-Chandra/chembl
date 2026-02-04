import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post(':type')
  async getResults(
    @Param('type') type: 'structures' | 'documents' | 'assays' | 'activities',
    @Body() body: { page: number; pageSize: number },
    @Req() req: Request,
  ) {
    const sessionId = req.cookies['chembl_search_sid'];

    if (!sessionId) {
      throw new Error('Search session expired');
    }

    return this.service.getResults(type, sessionId, body.page, body.pageSize);
  }
}
