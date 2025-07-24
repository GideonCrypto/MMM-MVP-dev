import { Module } from '@nestjs/common';
import { MarketDataModule } from './marketData/marketData.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { TransactionModule } from './transaction/transaction.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [MarketDataModule, UserModule, AuthModule, TransactionModule, PortfolioModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
