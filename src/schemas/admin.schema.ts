import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { BaseUser } from './base-user.schema';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin extends BaseUser {
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  is_superadmin: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin).plugin(
  MongooseDelete,
  { deletedAt: true, overrideMethods: 'all' },
);
