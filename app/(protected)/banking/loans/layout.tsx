import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Loans | FinePilot - Your Personal Finance Manager",
  description: "Manage your loans, track payments, and explore financing options to achieve your financial goals.",
};

export default function LoansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 