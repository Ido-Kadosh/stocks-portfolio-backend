import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { StockDto } from 'src/stocks/dto/stock.dto';
import { Stock } from 'src/stocks/schemas/stock.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id, email: user.email });
    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwtService.sign({ id: user._id, email: user.email });
    return { token };
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
