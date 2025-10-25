import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { Account } from './account.entity';
import { Ledger } from './ledger.entity';

@Entity('transactions')
export class Transaction {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column('uuid', { nullable: true })
	fromAccountId!: string;

	@Column('uuid', { nullable: true })
	toAccountId!: string;

	@Column('decimal', { precision: 15, scale: 2 })
	amount!: number;

	@Column()
	currency!: string;

	@Column()
	type!: string; // 'TRANSFER' or 'EXCHANGE'

	@CreateDateColumn()
	created_at!: Date;

	@ManyToOne(() => Account)
	@JoinColumn({ name: 'fromAccountId' })
	fromAccount!: Account;

	@ManyToOne(() => Account)
	@JoinColumn({ name: 'toAccountId' })
	toAccount!: Account;

	@OneToMany(() => Ledger, ledger => ledger.transaction)
	ledgerEntries!: Ledger[];
}
