import { Module } from '@nestjs/common';
import { MarketDataModule } from './marketData/marketData.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { TransactionModule } from './transaction/transaction.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [MarketDataModule, UserModule, AuthModule, TransactionModule, PortfolioModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
