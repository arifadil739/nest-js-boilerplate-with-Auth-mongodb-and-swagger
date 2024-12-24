import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
  })
  first_name: string;

  @ApiProperty({
    type: String,
  })
  @ApiProperty({
    type: String,
  })
  last_name: string;

  @ApiProperty({
    type: String,
  })
  country: string;

  @ApiProperty({
    type: String,
  })
  city: string;

  @ApiProperty({
    type: String,
  })
  phone_no: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  is_profile_completed: string;

  @ApiProperty({
    description: 'profile picture',
    nullable: false,
    default: '',
    required: false,
    type: 'string',
    format: 'binary',
  })
  profile_picture: any;

  @ApiProperty({
    description: 'cover photo',
    nullable: false,
    default: '',
    required: false,
    type: 'string',
    format: 'binary',
  })
  cover_photo: any;

  @ApiProperty({
    type: String,
  })
  address: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  maritial_status: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  completion_percentage: number;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  dob: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  notification_token: string;
}