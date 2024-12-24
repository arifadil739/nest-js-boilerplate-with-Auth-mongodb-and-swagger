import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Api Swagger Setup
  const userOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'apiBearerAuth',
          schema: {
            description: "Shared Api's",
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: '',
        },
      },
    },
  };

  const userConfig = new DocumentBuilder()
    .setTitle('The Nest App')
    .setDescription(`The Nest App user Api's`)
    .setVersion('1.0')
    .addBearerAuth(undefined, 'userBearerAuth')
    .build();

  const apiDocuments = SwaggerModule.createDocument(app, userConfig, {
    include: [AppModule],
  });
  SwaggerModule.setup('swagger/user', app, apiDocuments, userOptions);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      forbidUnknownValues: false,
      whitelist: false,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
