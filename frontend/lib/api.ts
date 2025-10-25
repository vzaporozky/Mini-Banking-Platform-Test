import { User, Wallet, Transaction } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Добавляем токен авторизации если есть
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

// Auth API
export const authApi = {
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async signUp(
    email: string,
    password: string,
    fullName: string
  ): Promise<{ user: User; token: string }> {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  },

  async getProfile(): Promise<User> {
    return apiRequest("/auth/profile");
  },
};

// Wallets API
export const walletsApi = {
  async getWallets(): Promise<Wallet[]> {
    const response = await apiRequest<{ data: Wallet[] }>("/accounts");
    return response.data;
  },
};

// Transactions API
export const transactionsApi = {
  async getTransactions(
    page = 1,
    limit = 10,
    type?: string
  ): Promise<{
    data: Transaction[];
    total: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type && type !== "all") {
      params.append("type", type);
    }

    return apiRequest(`/transactions?${params}`);
  },

  async createTransfer(
    recipientEmail: string,
    amount: number,
    currency: string
  ): Promise<Transaction> {
    return apiRequest("/transactions/transfer", {
      method: "POST",
      body: JSON.stringify({
        recipient_email: recipientEmail,
        amount,
        currency,
      }),
    });
  },

  async createExchange(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<Transaction> {
    return apiRequest("/transactions/exchange", {
      method: "POST",
      body: JSON.stringify({
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency,
      }),
    });
  },
};
