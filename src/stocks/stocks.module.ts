import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
