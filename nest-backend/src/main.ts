import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173', // 👈 frontend
    credentials: true, // 👈 REQUIRED for cookies
  });
  await app.listen(3000);
}
void bootstrap();
