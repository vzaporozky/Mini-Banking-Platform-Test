import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type WalletCardProps = {
  wallet: Wallet;
};

export function WalletCard({ wallet }: WalletCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600">
          {wallet.currency} Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatCurrency(wallet.balance, wallet.currency)}
        </div>
      </CardContent>
    </Card>
  );
}
