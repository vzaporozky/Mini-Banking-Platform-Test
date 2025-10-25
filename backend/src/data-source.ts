import { DataSource } from 'typeorm';
import { User } from './common/entities/user.entity';
import { Account } from './common/entities/account.entity';
import { Transaction } from './common/entities/transaction.entity';
import { Ledger } from './common/entities/ledger.entity';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	username: process.env.DB_USERNAME || 'postgres',
	password: process.env.DB_PASSWORD || 'password',
	database: process.env.DB_NAME || 'mini_bank',
	entities: [User, Account, Transaction, Ledger],
	migrations: ['migrations/*.ts'],
	synchronize: false,
	logging: process.env.NODE_ENV === 'development',
});
