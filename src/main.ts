import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { DriverModules } from './driver/driver.modules';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { CustomerModules } from './customer/customer.modules';
import { AdminModules } from './admin/admin.modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Api Swagger Setup
  const apiOptions: SwaggerCustomOptions = {
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

  const apiConfig = new DocumentBuilder()
    .setTitle('The Get App')
    .setDescription(`The Get App api Api's`)
    .setVersion('1.0')
    .addBearerAuth(undefined, 'apiBearerAuth')
    .build();

  const apiDocuments = SwaggerModule.createDocument(app, apiConfig, {
    include: [AppModule],
  });
  SwaggerModule.setup('swagger/api', app, apiDocuments, apiOptions);

  // Driver Swagger Setup
  const driverOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'driverBearerAuth',
          schema: {
            description: "Driver Api's",
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

  const driverConfig = new DocumentBuilder()
    .setTitle('The Get App')
    .setDescription(`The Get App Driver Api's`)
    .setVersion('1.0')
    .addBearerAuth(undefined, 'driverBearerAuth')
    .build();

  const driverDocuments = SwaggerModule.createDocument(app, driverConfig, {
    include: [...DriverModules],
  });
  SwaggerModule.setup('swagger/driver', app, driverDocuments, driverOptions);

  // Customer Swagger Setup
  const customerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'customerBearerAuth',
          schema: {
            description: "Customer Api's",
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

  const customerConfig = new DocumentBuilder()
    .setTitle('The Get App')
    .setDescription(`The Get App Customer Api's`)
    .setVersion('1.0')
    .addBearerAuth(undefined, 'customerBearerAuth')
    .build();

  const customerDocuments = SwaggerModule.createDocument(app, customerConfig, {
    include: [...CustomerModules],
  });
  SwaggerModule.setup(
    'swagger/customer',
    app,
    customerDocuments,
    customerOptions,
  );

  // Admin Swagger Setup
  const adminOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'adminBearerAuth',
          schema: {
            description: "Admin Api's",
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

  const adminConfig = new DocumentBuilder()
    .setTitle('The Get App')
    .setDescription(`The Get App Admin Api's`)
    .setVersion('1.0')
    .addBearerAuth(undefined, 'adminBearerAuth')
    .build();

  const adminDocuments = SwaggerModule.createDocument(app, adminConfig, {
    include: [...AdminModules],
  });
  SwaggerModule.setup('swagger/admin', app, adminDocuments, adminOptions);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      forbidUnknownValues: false,
      whitelist: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();
