import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../prisma/prisma.service';
@Module({
	imports: [],
	controllers: [AccountsController],
	providers: [AccountsService, PrismaService],
	exports: [AccountsService],
})
export class AccountsModule {}
