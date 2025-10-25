import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AccountsService {
	constructor(private prisma: PrismaService) {}
	async findByUserId(userId: string) {
		return this.prisma.account.findMany({ where: { userId } });
	}

	async getBalance(accountId: string) {
		const account = await this.prisma.account.findUnique({
			where: { id: accountId },
		});
		if (!account) throw new NotFoundException('Account not found');
		return { accountId, balance: account.balance, currency: account.currency };
	}

	async findByUserEmail(email: string) {
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) throw new NotFoundException('User not found');
		return this.prisma.account.findMany({ where: { userId: user.id } });
	}
}
