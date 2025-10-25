import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Ledger } from './ledger.entity';

@Entity('accounts')
export class Account {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('uuid')
	userId: string;

	@Column()
	currency: string;

	@Column('decimal', { precision: 15, scale: 2, default: 0.0 })
	balance: number;

	@CreateDateColumn()
	created_at: Date;

	@ManyToOne(() => User, user => user.accounts)
	@JoinColumn({ name: 'userId' })
	user: User;

	@OneToMany(() => Ledger, ledger => ledger.account)
	ledgerEntries: Ledger[];
}
