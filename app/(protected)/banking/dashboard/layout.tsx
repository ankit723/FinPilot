import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard | FinePilot - Your Personal Finance Manager",
  description: "Track your finances, manage your accounts and analyze your spending with FinePilot's intuitive dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 