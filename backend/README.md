# Mini Bank Platform - Backend

Backend for a mini banking platform implementing a double-entry ledger system
for financial transactions.

## Technologies

- **Node.js** with **NestJS** framework
- **PostgreSQL** database
- **TypeORM** for database operations
- **JWT** authentication
- **Docker** for containerization

## Database Structure

### Tables:

- `users` - user information
- `accounts` - user currency accounts (USD, EUR)
- `transactions` - transaction records
- `ledger` - double-entry ledger records for auditing

### Double-Entry Ledger

Each transaction creates balanced entries in the ledger:

- **DEBIT** (negative amount) - withdrawal from an account
- **CREDIT** (positive amount) - deposit to an account
- The sum of all entries for a single transaction always equals zero

## API Endpoints

### Authentication

- `POST /auth/login` - user login
- `GET /auth/me` - retrieve current user information

### Accounts

- `GET /accounts` - list of user accounts
- `GET /accounts/:id/balance` - balance of a specific account

### Transactions

- `POST /transactions/transfer` - transfer between users
- `POST /transactions/exchange` - currency exchange
- `GET /transactions` - transaction history with filtering

## Pre-installed Users

The system creates 3 test users upon initialization:

| Username | Password  | USD Balance | EUR Balance |
| -------- | --------- | ----------- | ----------- |
| user1    | password1 | $1000.00    | €500.00     |
| user2    | password2 | $1000.00    | €500.00     |
| user3    | password3 | $1000.00    | €500.00     |

## Currency Exchange Rates

- **1 USD = 0.92 EUR**
- **1 EUR = 1.09 USD** (inverse rate)

## Running the Application

### Local Development

1. **Install dependencies:**

```bash
npm install
```

2. **Set up the database:**

```bash

# Create a .env file based on .env.example
cp .env.example .env

# Run PostgreSQL locally or via Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mini_bank -p 5432:5432 -d postgres:latest
```

3. **Run migrations:**

```bash
npm run migration:run
```

4. **Seed with test data:**

```bash
npm run seed
```

5. **Run in development mode:**

```bash
npm run start:dev
```

### Docker

1. **Run with docker-compose:**

```bash
docker-compose up --build
```

2. **The application will be available at:**

- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

## Scripts

- `npm run build` - build the project
- `npm run start` - run in production
- `npm run start:dev` - run in development mode
- `npm run migration:run` - run migrations
- `npm run migration:revert` - revert migrations
- `npm run seed` - seed with test data

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- Input data validation
- Transactional integrity for all financial operations

## Architectural Decisions

1. **Double-Entry Ledger** - ensures full auditability of all financial
   operations
2. **Database Transactions** - guarantee data integrity during concurrent
   operations
3. **Separation of Concerns** - clear division between controllers, services,
   and entities
4. **Validation** - verification of all input data and business rules`;
