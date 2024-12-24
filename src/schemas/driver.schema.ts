import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { BaseUser } from './base-user.schema';

export type DriverDocument = HydratedDocument<Driver>;

@Schema({ timestamps: true })
export class Driver extends BaseUser {
 
}

export const DriverSchema = SchemaFactory.createForClass(Driver).plugin(
  MongooseDelete,
  { deletedAt: true, overrideMethods: 'all' },
);
