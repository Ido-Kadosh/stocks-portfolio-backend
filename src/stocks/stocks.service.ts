import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { isStock } from './schemas/stock.typeguard';

@Injectable()
export class StocksService {
  private apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('API_KEY');
  }

  async fetchStocks() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://financialmodelingprep.com/api/v3/available-traded/list?apikey=${this.apiKey}`,
        ),
      );
      const validStocks = response.data.slice(0, 50).filter(isStock); // Filter only valid stocks

      if (!validStocks.length) {
        throw new HttpException('No valid stock data found', 503);
      }

      return validStocks;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
