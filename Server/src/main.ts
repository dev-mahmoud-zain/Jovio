import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './Common/Pipes/custom.validation.pipe';
import cookieParser from 'cookie-parser';
import { ResponseStatusInterceptor } from './Common/Interceptors/response.status.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new CustomValidationPipe());

  app.use(cookieParser());

  app.useGlobalInterceptors(new ResponseStatusInterceptor());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();