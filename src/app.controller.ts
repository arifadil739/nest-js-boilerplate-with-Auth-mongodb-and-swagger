import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Api')
@ApiBearerAuth('apiBearerAuth')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.appService.create(createUserDto);
  }
}
