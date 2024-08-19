import { Stock } from './stock.schema';

export function isStock(obj: any): obj is Stock {
  return (
    typeof obj.symbol === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.exchange === 'string' &&
    typeof obj.exchangeShortName === 'string' &&
    typeof obj.price === 'number'
  );
}
