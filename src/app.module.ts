import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModules } from './admin/admin.modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModules } from './customer/customer.modules';
import { DriverModules } from './driver/driver.modules';
import { ValidationModule } from './shared-modules/validation.module';
import { DriverModule } from './driver/driver.module';
import { CustomerModule } from './customer/customer.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    ...DriverModules,
    ...CustomerModules,
    ...AdminModules,
    // forwardRef(() => DriverModule),
    forwardRef(() => CustomerModule),
    // forwardRef(() => AdminModule),
  ],
  controllers: [AppController],
  providers: [AppService, ...ValidationModule],
  exports: [AppService],
})
export class AppModule {}
