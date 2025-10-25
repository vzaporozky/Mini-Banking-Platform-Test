import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account } from "../common/entities/account.entity";

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>
  ) {}

  async findByUserId(userId: string) {
    return this.accountRepository.find({ where: { userId } });
  }

  async getBalance(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException("Account not found");
    return { accountId, balance: account.balance, currency: account.currency };
  }
}
