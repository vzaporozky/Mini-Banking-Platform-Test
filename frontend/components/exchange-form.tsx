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
import { ConfirmationDialog } from "@/components/confirmation-dialog";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const targetCurrency = sourceCurrency === "USD" ? "EUR" : "USD";
  const rate = sourceCurrency === "USD" ? EXCHANGE_RATE : 1 / EXCHANGE_RATE;

  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setConvertedAmount(Number((numAmount * rate).toFixed(2)));
      }
    } else {
      setConvertedAmount(0);
    }
  }, [amount, rate]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!amount || parseFloat(amount) <= 0) {
      errors.push("Amount must be greater than 0");
    }

    const sourceWallet = wallets.find((w) => w.currency === sourceCurrency);
    if (sourceWallet && amount) {
      const exchangeAmount = parseFloat(amount);
      if (sourceWallet.balance < exchangeAmount) {
        errors.push("Insufficient balance");
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmExchange = async () => {
    if (!user) return;

    setLoading(true);
    setShowConfirmation(false);

    try {
      const exchangeAmount = parseFloat(amount);
      const sourceWallet = wallets.find((w) => w.currency === sourceCurrency);
      const targetWallet = wallets.find((w) => w.currency === targetCurrency);

      if (!sourceWallet || !targetWallet) {
        throw new Error("Wallets not found");
      }

      // Execute exchange via API
      await transactionsApi.createExchange(
        exchangeAmount,
        sourceCurrency,
        targetCurrency
      );

      toast({
        type: "success",
        title: "Exchange Completed",
        description: `Successfully exchanged ${formatCurrency(
          exchangeAmount,
          sourceCurrency
        )} to ${formatCurrency(convertedAmount, targetCurrency)}`,
      });
      setAmount("");
      setValidationErrors([]);
      onSuccess();
    } catch (error: any) {
      toast({
        type: "error",
        title: "Exchange Failed",
        description: error.message || "An error occurred during exchange",
      });
    } finally {
      setLoading(false);
    }
  };

  const sourceWallet = wallets.find((w) => w.currency === sourceCurrency);

  return (
    <>
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
                onValueChange={(value: string) => {
                  setSourceCurrency(value as "USD" | "EUR");
                  setValidationErrors([]);
                }}
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
                onChange={(e) => {
                  setAmount(e.target.value);
                  setValidationErrors([]);
                }}
                placeholder="0.00"
                required
                disabled={loading}
                className={validationErrors.length > 0 ? "border-red-500" : ""}
              />
              {sourceWallet && (
                <p className="text-xs text-gray-500">
                  Available:{" "}
                  {formatCurrency(sourceWallet.balance, sourceCurrency)}
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

            {validationErrors.length > 0 && (
              <div className="p-3 border border-red-200 bg-red-50 rounded-md">
                <ul className="text-sm text-red-600 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || validationErrors.length > 0}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                "Review Exchange"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Confirm Exchange"
        description={`Are you sure you want to exchange ${formatCurrency(
          parseFloat(amount),
          sourceCurrency
        )} for ${formatCurrency(convertedAmount, targetCurrency)}?`}
        confirmText="Confirm Exchange"
        cancelText="Cancel"
        onConfirm={handleConfirmExchange}
        loading={loading}
      />
    </>
  );
}
