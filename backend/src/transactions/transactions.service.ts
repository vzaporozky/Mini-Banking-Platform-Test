import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
	constructor(private prisma: PrismaService) {}

	async transfer(
		fromAccountId: string,
		toAccountId: string,
		amount: number,
		currency: string
	) {
		if (amount <= 0) throw new BadRequestException('Amount must be positive');

		return this.prisma.$transaction(
			async (prisma: Prisma.TransactionClient) => {
				const fromAccount = await prisma.account.findFirst({
					where: { id: fromAccountId, currency },
				});
				const toAccount = await prisma.account.findFirst({
					where: { id: toAccountId, currency },
				});

				if (!fromAccount || !toAccount)
					throw new BadRequestException('Invalid account or currency');

				const fromBalance = fromAccount.balance.toNumber();
				if (fromBalance < amount)
					throw new BadRequestException('Insufficient funds');

				await prisma.account.update({
					where: { id: fromAccountId },
					data: { balance: { decrement: amount } },
				});

				await prisma.account.update({
					where: { id: toAccountId },
					data: { balance: { increment: amount } },
				});

				const transaction = await prisma.transaction.create({
					data: {
						fromAccountId,
						toAccountId,
						amount,
						currency,
						type: 'TRANSFER',
						ledgerEntries: {
							create: [
								{
									accountId: fromAccountId,
									amount: -amount,
									type: 'DEBIT',
								},
								{
									accountId: toAccountId,
									amount,
									type: 'CREDIT',
								},
							],
						},
					},
				});
				return {
					...transaction,
					amount: transaction.amount.toNumber(),
				};
			}
		);
	}

	async exchange(
		userId: string,
		fromCurrency: string,
		toCurrency: string,
		amount: number
	) {
		if (amount <= 0) throw new BadRequestException('Amount must be positive');
		const exchangeRate = fromCurrency === 'USD' ? 0.92 : 1 / 0.92;
		const convertedAmount = Number((amount * exchangeRate).toFixed(2));

		return this.prisma.$transaction(
			async (prisma: Prisma.TransactionClient) => {
				const fromAccount = await prisma.account.findFirst({
					where: { userId, currency: fromCurrency },
				});
				const toAccount = await prisma.account.findFirst({
					where: { userId, currency: toCurrency },
				});

				if (!fromAccount || !toAccount)
					throw new BadRequestException('Invalid account or currency');

				const fromBalance = fromAccount.balance.toNumber();
				if (fromBalance < amount)
					throw new BadRequestException('Insufficient funds');

				await prisma.account.update({
					where: { id: fromAccount.id },
					data: { balance: { decrement: amount } },
				});

				await prisma.account.update({
					where: { id: toAccount.id },
					data: { balance: { increment: convertedAmount } },
				});

				const transaction = await prisma.transaction.create({
					data: {
						fromAccountId: fromAccount.id,
						toAccountId: toAccount.id,
						amount,
						currency: fromCurrency,
						type: 'EXCHANGE',
						ledgerEntries: {
							create: [
								{
									accountId: fromAccount.id,
									amount: -amount,
									type: 'DEBIT',
								},
								{
									accountId: toAccount.id,
									amount: convertedAmount,
									type: 'CREDIT',
								},
							],
						},
					},
				});

				return {
					...transaction,
					amount: transaction.amount.toNumber(),
				};
			}
		);
	}

	async getTransactions(
		userId: string,
		type?: string,
		page: number = 1,
		limit: number = 10
	) {
		const skip = (page - 1) * limit;

		const where: any = {
			OR: [{ fromAccount: { userId } }, { toAccount: { userId } }],
		};

		if (type) {
			where.type = type;
		}

		const [transactions, total] = await Promise.all([
			this.prisma.transaction.findMany({
				where,
				skip,
				take: limit,
				orderBy: { created_at: 'desc' },
				include: {
					fromAccount: true,
					toAccount: true,
				},
			}),
			this.prisma.transaction.count({ where }),
		]);

		const formattedTransactions = transactions.map(transaction => ({
			...transaction,
			amount: transaction.amount.toNumber(),
			fromAccount: transaction.fromAccount
				? {
						...transaction.fromAccount,
						balance: transaction.fromAccount.balance.toNumber(),
					}
				: null,
			toAccount: transaction.toAccount
				? {
						...transaction.toAccount,
						balance: transaction.toAccount.balance.toNumber(),
					}
				: null,
		}));

		return {
			data: formattedTransactions,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}
}
