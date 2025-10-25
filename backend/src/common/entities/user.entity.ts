import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ unique: true })
	username!: string;

	@Column()
	password!: string;

	@CreateDateColumn()
	created_at!: Date;

	@OneToMany(() => Account, account => account.user)
	accounts: Account[] = [];
}
