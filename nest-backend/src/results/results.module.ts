import { Module } from '@nestjs/common';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    SearchModule, // 🔑 gives access to SearchService + session clients
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
