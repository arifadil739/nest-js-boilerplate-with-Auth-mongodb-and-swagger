import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Api')
@ApiBearerAuth('apiBearerAuth')
@Controller('api')
export class AppController {
  constructor() {}

}
