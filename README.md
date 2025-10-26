# Mini Banking Platform

A full-stack mini banking platform implementing a double-entry ledger system for secure financial transactions.

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Mini-Banking-Platform-Test

# Start all services
docker-compose up --build
cd frontend
npm i
npm run build
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL Database**: localhost:5432

### Manual Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database configuration

# Run database migrations
npm run migration:run

# Seed with test data
npm run seed

# Start development server
npm run start:dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 User Management Approach

**Pre-seeded Users** - The system comes with 3 pre-configured test users:

| Username | Password  | Initial USD Balance | Initial EUR Balance |
| -------- | --------- | ------------------- | ------------------- |
| user1    | password1 | $1,000.00           | €500.00             |
| user2    | password2 | $1,000.00           | €500.00             |
| user3    | password3 | $1,000.00           | €500.00             |

## 🏗️ Architecture & Design Decisions

### Backend (NestJS + PostgreSQL)

**Technology Stack:**

- **Framework**: NestJS for scalable, modular architecture
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Built-in DTO validation and custom business rules

**Key Design Decisions:**

1. **Double-Entry Ledger System**

   - Every financial transaction creates balanced debit/credit entries
   - Ensures full auditability and financial integrity
   - Sum of all ledger entries for a transaction always equals zero

2. **Database Transactions**

   - All financial operations wrapped in database transactions
   - Prevents partial updates and ensures data consistency
   - Handles concurrent operations safely

3. **Separation of Concerns**

   - Clear division between controllers, services, and entities
   - Modular architecture for maintainability and testability

4. **Security First**
   - Password hashing with bcrypt
   - JWT token expiration (24 hours)
   - Input validation and sanitization

### Frontend (Next.js + TypeScript)

**Technology Stack:**

- **Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context for authentication
- **Type Safety**: Full TypeScript implementation

**Key Features:**

- Responsive dashboard with account overview
- Real-time transaction history
- Currency exchange functionality
- Inter-user fund transfers
- Modern, accessible UI components

## 💰 Core Features

### ✅ Implemented

- **User Authentication** - Secure login with JWT
- **Account Management** - Multi-currency account support (USD, EUR)
- **Fund Transfers** - Secure transfers between users
- **Currency Exchange** - Real-time USD/EUR conversion
- **Transaction History** - Filterable transaction records
- **Double-Entry Ledger** - Full audit trail for all financial operations
- **Responsive UI** - Mobile-friendly interface

### 🔄 Currency Exchange Rates

- **1 USD = 0.92 EUR**
- **1 EUR = 1.09 USD**

All exchange operations use these fixed rates for consistency.

## ⚠️ Known Limitations & Trade-offs

### Technical Limitations

1. **Fixed Exchange Rates**

   - Uses static conversion rates rather than real-time market data
   - Simplified for demonstration purposes

2. **Pre-seeded Users Only**

   - No user registration functionality
   - Limited to 3 test accounts for simplicity

3. **Basic Error Handling**

   - Error messages could be more user-friendly
   - Limited recovery mechanisms for edge cases

4. **No Real-time Updates**
   - Manual refresh required to see updated balances
   - No WebSocket implementation for live updates

### Security Trade-offs

1. **Development JWT Secret**

   - Uses a simple secret key (should be rotated in production)
   - No refresh token implementation

2. **Basic Input Validation**
   - Validates business rules but lacks advanced sanitization
   - No rate limiting on API endpoints

## 🕒 Incomplete Features (Due to Time Constraints)

### High Priority

- **User Registration** - Ability for new users to create accounts
- **Password Reset** - Self-service password recovery
- **Real-time Notifications** - Live balance and transaction updates

### Medium Priority

- **Transaction Categorization** - Tags and categories for transactions
- **Advanced Reporting** - Financial reports and analytics
- **Admin Dashboard** - Administrative controls and user management

### Low Priority

- **Multi-language Support** - Internationalization
- **Dark/Light Theme** - User preference settings
- **Export Functionality** - CSV/PDF transaction exports

## 🗄️ Database Schema

### Core Tables

- `users` - User profiles and authentication
- `accounts` - Currency-specific account balances
- `transactions` - Transaction records with metadata
- `ledger` - Double-entry ledger for audit purposes

### Key Relationships

- Users have multiple accounts (one per currency)
- Transactions link source and destination accounts
- Ledger entries reference transactions and accounts

## 🔧 Development Scripts

### Backend

```bash
npm run start:dev      # Development mode with hot reload
npm run build          # Production build
npm run start          # Production server
npm run migration:run  # Run database migrations
npm run seed           # Seed with test data
```

### Frontend

```bash
npm run dev            # Development server
npm run build          # Production build
npm run start          # Production server
npm run lint           # Code linting
npm run typecheck      # TypeScript type checking
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Ensure PostgreSQL is running on port 5432
   - Check environment variables in backend/.env

2. **CORS Issues**

   - Backend configured to accept requests from frontend (localhost:3000)
   - Verify frontend API base URL configuration

3. **Migration Errors**
   - Run `npm run migration:revert` to reset
   - Then `npm run migration:run` to re-apply

## 📝 API Documentation

### Authentication Endpoints

- `POST /auth/login` - User authentication
- `GET /auth/me` - Current user information

### Account Endpoints

- `GET /accounts` - List user accounts
- `GET /accounts/:id/balance` - Specific account balance

### Transaction Endpoints

- `POST /transactions/transfer` - Transfer funds between users
- `POST /transactions/exchange` - Currency exchange
- `GET /transactions` - Transaction history with filters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is for demonstration purposes as part of a technical assessment.
