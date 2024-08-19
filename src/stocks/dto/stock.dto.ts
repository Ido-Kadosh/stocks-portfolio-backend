import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StockDto {
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  exchange: string;

  @IsNotEmpty()
  @IsString()
  exchangeShortName: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
