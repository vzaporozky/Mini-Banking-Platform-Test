import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AccountsService {
	constructor(private prisma: PrismaService) {}

	async findByUserId(userId: string) {
		const accounts = await this.prisma.account.findMany({ where: { userId } });
		return accounts.map(account => ({
			...account,
			balance: account.balance.toNumber(),
		}));
	}

	async getBalance(accountId: string) {
		const account = await this.prisma.account.findUnique({
			where: { id: accountId },
		});
		if (!account) throw new NotFoundException('Account not found');
		return {
			accountId,
			balance: account.balance.toNumber(),
			currency: account.currency,
		};
	}

	async findByUserEmail(email: string) {
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) throw new NotFoundException('User not found');
		const accounts = await this.prisma.account.findMany({
			where: { userId: user.id },
		});
		return accounts.map(account => ({
			...account,
			balance: account.balance.toNumber(),
		}));
	}

	async verifyBalanceConsistency(accountId: string) {
		const account = await this.prisma.account.findUnique({
			where: { id: accountId },
		});

		if (!account) {
			throw new NotFoundException('Account not found');
		}

		const ledgerTotal = await this.prisma.ledger.aggregate({
			where: { accountId },
			_sum: { amount: true },
		});

		const accountBalance = account.balance.toNumber();
		const ledgerSum = ledgerTotal._sum.amount?.toNumber() || 0;

		return {
			accountId,
			accountBalance,
			ledgerTotal: ledgerSum,
			consistent: Math.abs(accountBalance - ledgerSum) < 0.01, // Allow small rounding differences
			discrepancy: accountBalance - ledgerSum,
		};
	}
}
