import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { isStock } from './schemas/stock.typeguard';
import { Stock } from './schemas/stock.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/schemas/user.schema';
import { StockDto } from './dto/stock.dto';

@Injectable()
export class StocksService {
  private apiKey: string;
  private readonly pageSize = 50;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('API_KEY');
  }

  async fetchStocks(page: number): Promise<{ stocks: Stock[]; count: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://financialmodelingprep.com/api/v3/available-traded/list?apikey=${this.apiKey}`,
        ),
      );
      const totalStocks = response.data.length;
      const offset = (page - 1) * this.pageSize;
      const validStocks = response.data
        .slice(offset, offset + this.pageSize)
        .filter(isStock); // Filter only valid stocks

      if (!validStocks.length) {
        throw new HttpException('No valid stock data found', 503);
      }

      return { stocks: validStocks, count: totalStocks };
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  async addUserStock(user: User, stockDto: StockDto) {
    const userDocument = await this.userModel.findById(user.id);

    if (!userDocument) {
      throw new Error('User not found');
    }

    // make sure no duplicates
    const existingStock = userDocument.stocks.find(
      (stock) => stock.symbol === stockDto.symbol,
    );
    if (existingStock) {
      throw new ConflictException(
        `Stock with symbol ${stockDto.symbol} already exists`,
      );
    }
    userDocument.stocks.push(stockDto as Stock);
    const updatedUser = await userDocument.save();
    return updatedUser.stocks;
  }

  async removeUserStock(user: User, symbol: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user.id,
      { $pull: { stocks: { symbol } } },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User or stock not found');
    }
    return updatedUser.stocks;
  }

  async getUserStocks(userId: ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.stocks;
  }
}
