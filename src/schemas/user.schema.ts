import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

@Schema({ id: false })
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

@Schema({ id: false })
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

@Schema({ timestamps: true })
export class User {
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

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User).plugin(
  mongooseDelete,
  { deletedAt: true, overrideMethods: 'all' },
);
