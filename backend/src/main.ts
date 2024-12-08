import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './filters/http-error.filter';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Configs } from './config/config.enum';
import { AppConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const appConfig = app.get(ConfigService).get<AppConfig>(Configs.app);
  app.useGlobalFilters(new HttpErrorFilter(appConfig.nodeEnv));
  app.enableCors({ origin: appConfig.corsOrigin, credentials: true });
  await app.listen(appConfig.port);
}

bootstrap();
