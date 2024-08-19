import { Controller, Get, HttpException, Req, UseGuards } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks() {
    try {
      const stock = await this.stocksService.fetchStocks();
      return stock;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
