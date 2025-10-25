export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  currency: "USD" | "EUR";
  balance: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "transfer" | "exchange";
  amount: number;
  from_currency: "USD" | "EUR";
  to_currency?: "USD" | "EUR";
  converted_amount?: number;
  recipient_email?: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}
