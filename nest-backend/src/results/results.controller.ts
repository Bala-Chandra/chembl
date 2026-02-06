import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  private getSessionId(req: Request): string {
    const sid = req.cookies?.chembl_search_sid;
    if (!sid) throw new Error('Search session not found');
    return sid;
  }

  @Get('structures')
  structures(@Req() req: Request, @Query('page') page = '1') {
    return this.resultsService.getStructures(this.getSessionId(req), +page);
  }

  @Get('documents')
  documents(@Req() req: Request, @Query('page') page = '1') {
    return this.resultsService.getDocuments(this.getSessionId(req), +page);
  }

  @Get('assays')
  assays(@Req() req: Request, @Query('page') page = '1') {
    return this.resultsService.getAssays(this.getSessionId(req), +page);
  }

  @Get('activities')
  activities(@Req() req: Request, @Query('page') page = '1') {
    return this.resultsService.getActivities(this.getSessionId(req), +page);
  }
}
