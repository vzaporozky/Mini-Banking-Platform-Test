"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useToast } from "@/lib/toast";

export function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ type: "success", title: "Signed out successfully" });
    } catch (error: any) {
      toast({
        type: "error",
        title: "Error",
        description: error.message || "Failed to sign out",
      });
    }
  };

  if (!user) return null;

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold">Mini Banking</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "/dashboard" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "/transactions" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Transactions
            </Link>
            <div className="flex items-center gap-3 border-l pl-6">
              <span className="text-sm text-gray-600">{user.fullname}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
