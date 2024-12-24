import { Prop } from '@nestjs/mongoose';
import { USER_TYPE } from 'src/utils/enums/enums';

class Verification {
  @Prop({
    default: false,
    type: Boolean,
  })
  is_verified: boolean;

  @Prop({
    type: Number,
    default: null,
  })
  token: number;

  @Prop({
    default: null,
  })
  expiry: number;
}

class PasswordUpdate {
  @Prop({
    type: String,
  })
  token: string;

  @Prop({
    type: String,
  })
  code?: string;

  @Prop({
    type: Number,
  })
  expiry: number;

  @Prop({
    type: Number,
  })
  password_updated_at: number;
}

export abstract class BaseUser {
  @Prop({
    type: String,
    required: true,
  })
  first_name: string;

  @Prop({
    type: String,
    required: true,
  })
  last_name: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  email_verified: boolean;

  @Prop({
    nullable: false,
    type: String,
  })
  profile_picture: string;

  @Prop({
    type: String,
    required: true,
  })
  phone_no: string;

  @Prop({
    type: String,
    required: true,
  })
  firebase_uid: string;

  @Prop({
    type: String,
    required: true,
  })
  user_type: USER_TYPE;

  @Prop({
    nullable: false,
    type: String,
  })
  country: string;

  @Prop({
    nullable: false,
    type: String,
  })
  city: string;

  @Prop({
    nullable: false,
    type: String,
  })
  password: string;

  @Prop({
    nullable: false,
  })
  verification: Verification;

  @Prop({
    nullable: true,
  })
  passwordUpdate: PasswordUpdate;
  
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  disabled: boolean;
}
