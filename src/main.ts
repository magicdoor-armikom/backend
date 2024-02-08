import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from "@sentry/node";
import { SentryFilter } from './sentry.filter';

async function bootstrap() {
  Sentry.init({
    dsn: "https://5954db1374a5123390fc659bafc943a8@o4506704171237376.ingest.sentry.io/4506704174645248",

  });
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));
  
  await app.listen(port); 
}

bootstrap();
