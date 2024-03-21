import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { CorsConfig, SwaggerConfig } from 'config/interface';
import { AppModule } from 'module/app.module';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfig>('cors');

  app.enableCors(corsConfig);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  const swagger = configService.get<SwaggerConfig>('swagger');
  const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle(swagger.title)
    .setVersion(swagger.version)
    .setLicense(swagger.license.name, swagger.license.url)
    .setContact(
      swagger.contact.name,
      swagger.contact.url,
      swagger.contact.email,
    )
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('port');
  const host = configService.get<string>('host');
  await app.listen(port, host);

  logger.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();
