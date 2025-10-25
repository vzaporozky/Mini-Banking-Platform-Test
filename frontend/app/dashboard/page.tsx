"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { WalletCard } from "@/components/wallet-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransferForm } from "@/components/transfer-form";
import { ExchangeForm } from "@/components/exchange-form";
import { Wallet, Transaction } from "@/lib/types";
import { walletsApi, transactionsApi } from "@/lib/api";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [walletsData, transactionsData] = await Promise.all([
        walletsApi.getWallets(),
        transactionsApi.getTransactions(1, 5),
      ]);

      setWallets(walletsData);
      setTransactions(transactionsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.fullname}</h1>
          <p className="text-gray-600">Manage your wallets and transactions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {wallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Tabs defaultValue="transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="exchange">Exchange</TabsTrigger>
            </TabsList>
            <TabsContent value="transfer">
              <TransferForm wallets={wallets} onSuccess={fetchData} />
            </TabsContent>
            <TabsContent value="exchange">
              <ExchangeForm wallets={wallets} onSuccess={fetchData} />
            </TabsContent>
          </Tabs>

          <RecentTransactions transactions={transactions} />
        </div>
      </main>
    </div>
  );
}
