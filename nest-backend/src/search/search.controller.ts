import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Post('counts')
  async getCounts(
    @Body()
    body: {
      category: string;
      value: string;
    },
  ) {
    // v1: structure only
    return this.service.getCounts(body.value);
  }
}
