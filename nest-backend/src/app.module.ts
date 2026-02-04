import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultsModule } from './results/results.module';
import { DatabaseModule } from './database/database.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    DatabaseModule, // DB first
    SearchModule, // search feature
    ResultsModule, // feature module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
