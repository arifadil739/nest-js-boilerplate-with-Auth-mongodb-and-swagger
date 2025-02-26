import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
// import { USER_TYPE } from '../../utils/enums/enums';
import { USER_TYPE } from 'src/utils/enums/enums';

export class CreateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    enum: USER_TYPE,
    required: true,
  })
  user_type: USER_TYPE;

  @ApiProperty({
    type: String,
  })
  phone_no: string;

  @ApiProperty({
    type: String,
  })
  password: string;
}
