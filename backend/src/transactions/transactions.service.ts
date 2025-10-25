import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Account } from "../common/entities/account.entity";
import { Transaction } from "../common/entities/transaction.entity";
import { Ledger } from "../common/entities/ledger.entity";
import { v4 as uuid } from "uuid";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Ledger) private ledgerRepository: Repository<Ledger>,
    private dataSource: DataSource
  ) {}

  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    currency: string
  ) {
    if (amount <= 0) throw new BadRequestException("Amount must be positive");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fromAccount = await queryRunner.manager.findOne(Account, {
        where: { id: fromAccountId, currency },
      });
      const toAccount = await queryRunner.manager.findOne(Account, {
        where: { id: toAccountId, currency },
      });

      if (!fromAccount || !toAccount)
        throw new BadRequestException("Invalid account or currency");
      if (fromAccount.balance < amount)
        throw new BadRequestException("Insufficient funds");

      // Update balances
      await queryRunner.manager.update(Account, fromAccountId, {
        balance: () => `balance - ${amount}`,
      });
      await queryRunner.manager.update(Account, toAccountId, {
        balance: () => `balance + ${amount}`,
      });

      // Create transaction
      const transaction = await queryRunner.manager.save(Transaction, {
        id: uuid(),
        fromAccountId,
        toAccountId,
        amount,
        currency,
        type: "TRANSFER",
      });

      // Create ledger entries
      await queryRunner.manager.save(Ledger, [
        {
          id: uuid(),
          accountId: fromAccountId,
          transactionId: transaction.id,
          amount: -amount,
          type: "DEBIT",
        },
        {
          id: uuid(),
          accountId: toAccountId,
          transactionId: transaction.id,
          amount,
          type: "CREDIT",
        },
      ]);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async exchange(
    userId: string,
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ) {
    if (amount <= 0) throw new BadRequestException("Amount must be positive");
    const exchangeRate = fromCurrency === "USD" ? 0.92 : 1 / 0.92;
    const convertedAmount = Number((amount * exchangeRate).toFixed(2));

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fromAccount = await queryRunner.manager.findOne(Account, {
        where: { userId, currency: fromCurrency },
      });
      const toAccount = await queryRunner.manager.findOne(Account, {
        where: { userId, currency: toCurrency },
      });

      if (!fromAccount || !toAccount)
        throw new BadRequestException("Invalid account or currency");
      if (fromAccount.balance < amount)
        throw new BadRequestException("Insufficient funds");

      // Update balances
      await queryRunner.manager.update(Account, fromAccount.id, {
        balance: () => `balance - ${amount}`,
      });
      await queryRunner.manager.update(Account, toAccount.id, {
        balance: () => `balance + ${convertedAmount}`,
      });

      // Create transaction
      const transaction = await queryRunner.manager.save(Transaction, {
        id: uuid(),
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount,
        currency: fromCurrency,
        type: "EXCHANGE",
      });

      // Create ledger entries
      await queryRunner.manager.save(Ledger, [
        {
          id: uuid(),
          accountId: fromAccount.id,
          transactionId: transaction.id,
          amount: -amount,
          type: "DEBIT",
        },
        {
          id: uuid(),
          accountId: toAccount.id,
          transactionId: transaction.id,
          amount: convertedAmount,
          type: "CREDIT",
        },
      ]);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactions(
    userId: string,
    type?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const query = this.transactionRepository
      .createQueryBuilder("transaction")
      .where(
        "transaction.fromAccount.userId = :userId OR transaction.toAccount.userId = :userId",
        { userId }
      );

    if (type) query.andWhere("transaction.type = :type", { type });
    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("transaction.created_at", "DESC");

    return query.getMany();
  }
}
