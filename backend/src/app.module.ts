import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';

import { User } from './common/entities/user.entity';
import { Account } from './common/entities/account.entity';
import { Transaction } from './common/entities/transaction.entity';
import { Ledger } from './common/entities/ledger.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT) || 5432,
			username: process.env.DB_USERNAME || 'postgres',
			password: process.env.DB_PASSWORD || 'password',
			database: process.env.DB_NAME || 'mini_bank',
			entities: [User, Account, Transaction, Ledger],
			synchronize: process.env.NODE_ENV !== 'production',
			logging: process.env.NODE_ENV === 'development',
		}),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key',
			signOptions: { expiresIn: '24h' },
		}),
		PassportModule,
		AuthModule,
		AccountsModule,
		TransactionsModule,
	],
})
export class AppModule {}
