import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Transactions | FinePilot - Your Personal Finance Manager",
  description: "Track and analyze your financial transactions to better understand your spending habits and manage your budget.",
};

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 