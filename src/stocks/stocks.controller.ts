import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { AuthGuard } from '@nestjs/passport';
import { StockDto } from './dto/stock.dto';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(@Query('page') page: string) {
    try {
      const pageNumber = parseInt(page, 10) || 1;

      const stock = await this.stocksService.fetchStocks(pageNumber);
      return stock;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Put('/user')
  @UseGuards(AuthGuard())
  addUserStock(@Body() stockDto: StockDto, @Req() req) {
    return this.stocksService.addUserStock(req.user, stockDto);
  }

  @Get('/user')
  @UseGuards(AuthGuard())
  getUserStocks(@Req() req) {
    return this.stocksService.getUserStocks(req.user.id);
  }

  @Delete('/user/:symbol')
  @UseGuards(AuthGuard())
  removeUserStock(@Param('symbol') symbol: string, @Req() req) {
    return this.stocksService.removeUserStock(req.user, symbol);
  }
}
