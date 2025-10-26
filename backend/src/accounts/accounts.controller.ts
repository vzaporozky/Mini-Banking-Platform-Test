import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('accounts')
export class AccountsController {
	constructor(private accountsService: AccountsService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async listAccounts(@Request() req: any) {
		return this.accountsService.findByUserId(req.user.sub);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id/balance')
	async getBalance(@Param('id') id: string) {
		return this.accountsService.getBalance(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('by-email/:email')
	async getAccountsByEmail(@Param('email') email: string) {
		return this.accountsService.findByUserEmail(email);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id/verify-balance')
	async verifyBalanceConsistency(@Param('id') id: string) {
		return this.accountsService.verifyBalanceConsistency(id);
	}
}
