import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './Common/Pipes/custom.validation.pipe';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new CustomValidationPipe());

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();