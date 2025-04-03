import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Accounts | FinePilot - Your Personal Finance Manager",
  description: "Manage your bank accounts, track balances, and view your transaction history with FinePilot.",
};

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 