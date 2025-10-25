import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

type RecentTransactionsProps = {
  transactions: Transaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getIcon = (type: string) => {
    if (type === "exchange") {
      return <RefreshCw className="h-4 w-4 text-blue-600" />;
    }
    return <ArrowUpRight className="h-4 w-4 text-green-600" />;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-100 p-2">
                    {getIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.type === "exchange"
                        ? `Exchange ${transaction.from_currency} to ${transaction.to_currency}`
                        : `Transfer to ${transaction.recipient_email}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatCurrency(
                      transaction.amount,
                      transaction.from_currency
                    )}
                  </p>
                  {transaction.type === "exchange" &&
                    transaction.converted_amount && (
                      <p className="text-xs text-gray-500">
                        →{" "}
                        {formatCurrency(
                          transaction.converted_amount,
                          transaction.to_currency!
                        )}
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
