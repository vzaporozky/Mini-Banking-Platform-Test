"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth-context";
import { Wallet } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { transactionsApi } from "@/lib/api";

type ExchangeFormProps = {
  wallets: Wallet[];
  onSuccess: () => void;
};

const EXCHANGE_RATE = 0.92;

export function ExchangeForm({ wallets, onSuccess }: ExchangeFormProps) {
  const [sourceCurrency, setSourceCurrency] = useState<"USD" | "EUR">("USD");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const targetCurrency = sourceCurrency === "USD" ? "EUR" : "USD";
  const rate = sourceCurrency === "USD" ? EXCHANGE_RATE : 1 / EXCHANGE_RATE;

  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setConvertedAmount(numAmount * rate);
      }
    } else {
      setConvertedAmount(0);
    }
  }, [amount, rate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const exchangeAmount = parseFloat(amount);

      if (exchangeAmount <= 0) {
        toast({
          type: "error",
          title: "Error",
          description: "Amount must be greater than 0",
        });
        return;
      }

      const sourceWallet = wallets.find((w) => w.currency === sourceCurrency);
      const targetWallet = wallets.find((w) => w.currency === targetCurrency);

      if (!sourceWallet || !targetWallet) {
        toast({
          type: "error",
          title: "Error",
          description: "Wallets not found",
        });
        return;
      }

      if (sourceWallet.balance < exchangeAmount) {
        toast({
          type: "error",
          title: "Error",
          description: "Insufficient balance",
        });
        return;
      }

      const converted = exchangeAmount * rate;

      // Выполняем обмен через API
      await transactionsApi.createExchange(
        exchangeAmount,
        sourceCurrency,
        targetCurrency
      );

      toast({ type: "success", title: "Exchange completed successfully" });
      setAmount("");
      onSuccess();
    } catch (error: any) {
      toast({
        type: "error",
        title: "Error",
        description: error.message || "Exchange failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Currency</CardTitle>
        <CardDescription>Convert between USD and EUR</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-currency">From</Label>
            <Select
              value={sourceCurrency}
              onValueChange={(value: string) =>
                setSourceCurrency(value as "USD" | "EUR")
              }
            >
              <SelectTrigger id="source-currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exchange-amount">Amount</Label>
            <Input
              id="exchange-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              disabled={loading}
            />
            {sourceCurrency &&
              wallets.find((w) => w.currency === sourceCurrency) && (
                <p className="text-xs text-gray-500">
                  Available:{" "}
                  {formatCurrency(
                    wallets.find((w) => w.currency === sourceCurrency)!.balance,
                    sourceCurrency
                  )}
                </p>
              )}
          </div>
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Exchange Rate:</span>
              <span className="text-sm font-medium">
                1 {sourceCurrency} = {rate.toFixed(4)} {targetCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">You will receive:</span>
              <span className="text-lg font-bold">
                {formatCurrency(convertedAmount, targetCurrency)}
              </span>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Exchange"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
