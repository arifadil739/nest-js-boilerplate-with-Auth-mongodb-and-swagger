import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { BaseUser } from './base-user.schema';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer extends BaseUser {
 
}

export const CustomerSchema = SchemaFactory.createForClass(Customer).plugin(
  MongooseDelete,
  { deletedAt: true, overrideMethods: 'all' },
);
