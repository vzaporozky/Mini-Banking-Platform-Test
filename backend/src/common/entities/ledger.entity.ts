import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Transaction } from './transaction.entity';

@Entity('ledger')
export class Ledger {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('uuid')
	accountId: string;

	@Column('uuid')
	transactionId: string;

	@Column('decimal', { precision: 15, scale: 2 })
	amount: number;

	@Column()
	type: string; // 'DEBIT' or 'CREDIT'

	@CreateDateColumn()
	created_at: Date;

	@ManyToOne(() => Account, account => account.ledgerEntries)
	@JoinColumn({ name: 'accountId' })
	account: Account;

	@ManyToOne(() => Transaction, transaction => transaction.ledgerEntries)
	@JoinColumn({ name: 'transactionId' })
	transaction: Transaction;
}
