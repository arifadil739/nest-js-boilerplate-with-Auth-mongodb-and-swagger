import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt-strategy';
import { JwtAuthGuard } from './guards/jwt-guard';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name:User.name, schema: UserSchema}]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
            inject: [ConfigService],
            useFactory: async(configService: ConfigService)=>({
              secret: configService.get('JWT_KEY'),
              signOptions: { expiresIn: '1d' }, 
            }),

    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
