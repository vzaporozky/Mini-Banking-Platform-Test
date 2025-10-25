"use client";

import { useState } from "react";
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
import { transactionsApi, walletsApi } from "@/lib/api";

type TransferFormProps = {
  wallets: Wallet[];
  onSuccess: () => void;
};

export function TransferForm({ wallets, onSuccess }: TransferFormProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [currency, setCurrency] = useState<"USD" | "EUR">("USD");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const transferAmount = parseFloat(amount);

      if (transferAmount <= 0) {
        toast({
          type: "error",
          title: "Error",
          description: "Amount must be greater than 0",
        });
        return;
      }

      const senderWallet = wallets.find((w) => w.currency === currency);
      if (!senderWallet) {
        toast({
          type: "error",
          title: "Error",
          description: "Wallet not found",
        });
        return;
      }

      if (senderWallet.balance < transferAmount) {
        toast({
          type: "error",
          title: "Error",
          description: "Insufficient balance",
        });
        return;
      }

      if (recipientEmail === user.email) {
        toast({
          type: "error",
          title: "Error",
          description: "Cannot transfer to yourself",
        });
        return;
      }

      // Получаем аккаунты получателя по email
      const recipientWallets = await walletsApi.getWalletsByEmail(
        recipientEmail
      );
      const recipientWallet = recipientWallets.find(
        (w) => w.currency === currency
      );

      if (!recipientWallet) {
        toast({
          type: "error",
          title: "Error",
          description: "Recipient doesn't have a wallet in this currency",
        });
        return;
      }

      // Выполняем перевод через API
      await transactionsApi.createTransfer(
        senderWallet.id,
        recipientWallet.id,
        transferAmount,
        currency
      );

      toast({ type: "success", title: "Transfer completed successfully" });
      setRecipientEmail("");
      setAmount("");
      onSuccess();
    } catch (error: any) {
      toast({
        type: "error",
        title: "Error",
        description: error.message || "Transfer failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
        <CardDescription>Send money to another user</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input
              id="recipient"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currency}
              onValueChange={(value: string) =>
                setCurrency(value as "USD" | "EUR")
              }
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              disabled={loading}
            />
            {currency && wallets.find((w) => w.currency === currency) && (
              <p className="text-xs text-gray-500">
                Available:{" "}
                {formatCurrency(
                  wallets.find((w) => w.currency === currency)!.balance,
                  currency
                )}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
