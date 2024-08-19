import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Stock extends Document {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  exchange: string;

  @Prop({ required: true })
  exchangeShortName: string;

  @Prop({ required: true })
  price: number;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
