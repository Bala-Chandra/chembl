import { Body, Controller, Param, Post } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Post(':type')
  async getResults(
    @Param('type') type: 'structures' | 'documents' | 'assays' | 'activities',
    @Body()
    body: {
      sessionId: string;
      page: number;
      pageSize: number;
    },
  ) {
    const { sessionId, page, pageSize } = body;

    return this.service.getResults(type, sessionId, page, pageSize);
  }
}
