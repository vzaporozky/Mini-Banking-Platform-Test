import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1698000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY,
        username VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE accounts (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        currency VARCHAR NOT NULL,
        balance DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE transactions (
        id UUID PRIMARY KEY,
        from_account_id UUID REFERENCES accounts(id),
        to_account_id UUID REFERENCES accounts(id),
        amount DECIMAL(15,2) NOT NULL,
        currency VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE ledger (
        id UUID PRIMARY KEY,
        account_id UUID REFERENCES accounts(id),
        transaction_id UUID REFERENCES transactions(id),
        amount DECIMAL(15,2) NOT NULL,
        type VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE ledger;
      DROP TABLE transactions;
      DROP TABLE accounts;
      DROP TABLE users;
    `);
  }
}
