import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Account } from '../common/entities/account.entity';
import { Transaction } from '../common/entities/transaction.entity';
import { Ledger } from '../common/entities/ledger.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Account, Transaction, Ledger])],
	controllers: [TransactionsController],
	providers: [TransactionsService],
	exports: [TransactionsService],
})
export class TransactionsModule {}
