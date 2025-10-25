"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Transaction } from "@/lib/types";
import { transactionsApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredType, setFilteredType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await transactionsApi.getTransactions(
        currentPage,
        PAGE_SIZE,
        filteredType !== "all" ? filteredType : undefined
      );

      setTransactions(response.data);
      setTotalCount(response.total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filteredType]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, filteredType, currentPage, fetchTransactions]);


  const getIcon = (type: string) => {
    if (type === "exchange") {
      return <RefreshCw className="h-5 w-5 text-blue-600" />;
    }
    return <ArrowUpRight className="h-5 w-5 text-green-600" />;
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (authLoading) {
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
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-gray-600">View all your transactions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filter by:</span>
                <Select value={filteredType} onValueChange={setFilteredType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="exchange">Exchange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-gray-500">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No transactions found
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-gray-100 p-3">
                          {getIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.type === "exchange"
                              ? `Exchange ${transaction.from_currency} to ${transaction.to_currency}`
                              : `Transfer to ${transaction.recipient_email}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(
                            transaction.amount,
                            transaction.from_currency
                          )}
                        </p>
                        {transaction.type === "exchange" &&
                          transaction.converted_amount && (
                            <p className="text-sm text-gray-500">
                              →{" "}
                              {formatCurrency(
                                transaction.converted_amount,
                                transaction.to_currency!
                              )}
                            </p>
                          )}
                        <p className="text-xs text-gray-400 capitalize mt-1">
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                      {Math.min(currentPage * PAGE_SIZE, totalCount)} of{" "}
                      {totalCount} transactions
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
