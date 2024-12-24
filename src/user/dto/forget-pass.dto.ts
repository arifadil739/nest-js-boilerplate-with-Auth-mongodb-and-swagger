import { ApiProperty } from '@nestjs/swagger';

export class ForgetPassDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  email: string;
}