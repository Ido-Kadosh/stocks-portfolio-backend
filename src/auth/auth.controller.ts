import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { StockDto } from 'src/stocks/dto/stock.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() SignUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(SignUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Put('/stocks')
  @UseGuards(AuthGuard())
  addUserStock(@Body() stockDto: StockDto, @Req() req) {
    return this.authService.addUserStock(req.user, stockDto);
  }

  @Get('/stocks')
  @UseGuards(AuthGuard())
  getUserStocks(@Req() req) {
    return this.authService.getUserStocks(req.user.id);
  }

  @Delete('/stock/:symbol')
  @UseGuards(AuthGuard())
  removeUserStock(@Param('symbol') symbol: string, @Req() req) {
    return this.authService.removeUserStock(req.user, symbol);
  }
}
