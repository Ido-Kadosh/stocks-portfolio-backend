import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Stock, StockSchema } from 'src/stocks/schemas/stock.schema';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [StockSchema], default: [] })
  stocks: Stock[];
}

export const UserSchema = SchemaFactory.createForClass(User);
