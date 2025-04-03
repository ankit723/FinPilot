'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import GlassCard from '@/app/components/ui/glass-card';
import Todo from '@/app/components/ui/Todo';
import Link from 'next/link';
import { ArrowRight, CreditCard, PiggyBank, LineChart, Landmark, ShieldCheck, Bell, AlertTriangle, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// Types for our data
interface Account {
  id: string;
  type: string;
  balance: number;
  accountNumber: string;
  status: string;
  color?: string;
}

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  time: string;
  category: string;
  createdAt: string;
  transactionType?: string;
}

interface FinanceInsight {
  id: string;
  title: string;
  description: string;
}

export default function Dashboard() {
  const { theme } = useTheme();
  const { user, isLoaded: isUserLoaded } = useUser();
  const isDark = theme !== 'light';
  const [balanceVisible, setBalanceVisible] = useState(false);
  
  // State for dynamic data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<FinanceInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch account data
  useEffect(() => {
    const fetchData = async () => {
      if (!isUserLoaded || !user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch accounts
        const accountsResponse = await fetch('/api/banking/accounts');
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const accountsData = await accountsResponse.json();

        // Add color to accounts for UI purposes
        const coloredAccounts = accountsData.map((account: Account, index: number) => ({
          ...account,
          color: index % 2 === 0 ? 'blue' : 'purple'
        }));
        
        setAccounts(coloredAccounts);
        
        // Fetch recent transactions
        const transactionsResponse = await fetch('/api/banking/transactions?limit=4');
        if (!transactionsResponse.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const transactionsData = await transactionsResponse.json();
        
        // Format transactions for display
        const formattedTransactions = transactionsData.map((tx: any) => {
          const createdAt = new Date(tx.createdAt);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          let dateDisplay;
          if (createdAt.toDateString() === today.toDateString()) {
            dateDisplay = 'Today';
          } else if (createdAt.toDateString() === yesterday.toDateString()) {
            dateDisplay = 'Yesterday';
          } else {
            dateDisplay = createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          
          // Make sure we have the correct category for the transaction icon
          const category = tx.category || 
                          (tx.transactionType === 'DEPOSIT' ? 'Income' : 
                           tx.transactionType === 'WITHDRAWAL' ? 'Expense' : 'Transfer');
          
          return {
            ...tx,
            date: dateDisplay,
            time: createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            category: category
          };
        });
        
        setTransactions(formattedTransactions);
        
        // Generate insights based on transaction data
        if (transactionsData.length > 0) {
          const insights = generateInsights(transactionsData, accountsData);
          setInsights(insights);
        } else {
          setInsights([{
            id: 'welcome',
            title: 'Welcome to your FinePilot dashboard',
            description: 'Start by exploring your accounts and tracking your finances'
          }]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading your data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isUserLoaded, user]);
  
  // Generate insights based on real data
  const generateInsights = (transactions: any[], accounts: any[]) => {
    const insights: FinanceInsight[] = [];
    
    // Calculate total balance
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Calculate spending by category
    const categories = transactions
      .filter(tx => tx.amount < 0)
      .reduce((acc: any, tx: any) => {
        const category = tx.category || 'Uncategorized';
        if (!acc[category]) acc[category] = 0;
        acc[category] += Math.abs(tx.amount);
        return acc;
      }, {});
    
    // Find top spending category
    let topCategory = '';
    let topAmount = 0;
    
    Object.entries(categories).forEach(([category, amount]: [string, any]) => {
      if (amount > topAmount) {
        topCategory = category;
        topAmount = amount;
      }
    });
    
    if (topCategory) {
      insights.push({
        id: 'spending',
        title: `Highest spending in ${topCategory}`,
        description: `You've spent ₹${topAmount.toFixed(2)} in this category recently`
      });
    }
    
    // Balance insight
    if (totalBalance > 0) {
      insights.push({
        id: 'balance',
        title: `Total balance: ₹${totalBalance.toFixed(2)}`,
        description: `Across ${accounts.length} account${accounts.length !== 1 ? 's' : ''}`
      });
    }
    
    // Recent deposit insight
    const recentDeposit = transactions.find(tx => tx.amount > 0);
    if (recentDeposit) {
      insights.push({
        id: 'deposit',
        title: 'Recent deposit received',
        description: `₹${recentDeposit.amount.toFixed(2)} was added to your account`
      });
    }
    
    return insights.slice(0, 3); // Limit to 3 insights
  };
  
  // Get transaction icon based on category and transaction type
  const getTransactionIcon = (category: string, isPositive: boolean, transactionType?: string) => {
    if (isPositive || category === 'Income' || transactionType === 'DEPOSIT') {
      return <LineChart size={18} />;
    }
    
    if (transactionType === 'TRANSFER') {
      return <ArrowRight size={18} />;
    }
    
    switch (category.toLowerCase()) {
      case 'shopping':
        return <CreditCard size={18} />;
      case 'utilities':
        return <Landmark size={18} />;
      case 'dining':
        return <Landmark size={18} />; 
      case 'expense':
      case 'withdrawal':
        return <CreditCard size={18} />;
      default:
        return <CreditCard size={18} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className={`h-10 w-10 animate-spin mb-4 mx-auto ${isDark ? 'text-white/60' : 'text-slate-600'}`} />
          <p className={isDark ? 'text-white/80' : 'text-slate-700'}>Loading your financial data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <GlassCard intensity="medium" className={`p-6 border ${isDark ? 'border-red-500/40' : 'border-red-300'}`}>
        <div className="text-center py-8">
          <AlertTriangle className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Unable to Load Dashboard</h2>
          <p className={isDark ? 'text-white/70' : 'text-slate-600'}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 rounded-md ${
              isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Retry
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        <h1 className="text-3xl font-bold">
          {user ? `Welcome, ${user.firstName || 'User'}!` : 'Welcome to Your Dashboard'}
        </h1>
        <p className={isDark ? 'text-white/70' : 'text-slate-600'}>
          Manage your accounts, track transactions, and achieve your financial goals
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Transfer Money', icon: <CreditCard size={24} />, link: '/banking/transfer', color: 'blue' },
          { title: 'Track Expenses', icon: <Landmark size={24} />, link: '/banking/bills', color: 'purple' },
          { title: 'Set Financial Goals', icon: <PiggyBank size={24} />, link: '/banking/budget', color: 'teal' },
        ].map((action) => (
          <Link key={action.title} href={action.link}>
            <GlassCard 
              intensity="light" 
              hoverEffect={true}
              className={`p-4 h-full flex items-center justify-between border ${isDark ? 'border-white/10' : 'border-slate-200'}`}
            >
              <div className="flex items-center">
                <div className={`mr-4 p-3 rounded-md ${
                  isDark
                    ? action.color === 'blue' ? 'bg-blue-500/20' : action.color === 'purple' ? 'bg-purple-500/20' : 'bg-teal-500/20'
                    : action.color === 'blue' ? 'bg-blue-100' : action.color === 'purple' ? 'bg-purple-100' : 'bg-teal-100'
                }`}>
                  <span className={
                    isDark
                      ? action.color === 'blue' ? 'text-blue-400' : action.color === 'purple' ? 'text-purple-400' : 'text-teal-400'
                      : action.color === 'blue' ? 'text-blue-600' : action.color === 'purple' ? 'text-purple-600' : 'text-teal-600'
                  }>
                    {action.icon}
                  </span>
                </div>
                <div>
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{action.title}</h3>
                </div>
              </div>
              <ArrowRight size={20} className={`${isDark ? 'text-white/50' : 'text-slate-400'}`} />
            </GlassCard>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts Overview */}
        <div className="lg:col-span-2">
          <GlassCard 
            intensity="medium" 
            className={`p-4 border ${isDark ? 'border-white/10' : 'border-slate-200'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Your Accounts
              </h2>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                {balanceVisible ? 'Hide' : 'Show'} Balances
              </button>
            </div>
            
            {accounts.length > 0 ? (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div 
                    key={account.id}
                    className={`p-4 rounded-lg ${
                      isDark 
                        ? account.color === 'blue' ? 'bg-blue-900/30' : 'bg-purple-900/30'
                        : account.color === 'blue' ? 'bg-blue-50' : 'bg-purple-50'
                    } border ${
                      isDark
                        ? account.color === 'blue' ? 'border-blue-700/30' : 'border-purple-700/30'
                        : account.color === 'blue' ? 'border-blue-200' : 'border-purple-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                          {account.accountNumber}
                        </p>
                        <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {account.type === 'SAVINGS' 
                            ? 'Savings Account' 
                            : account.type === 'CURRENT' 
                              ? 'Current Account' 
                              : 'Fixed Deposit'}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                          {account.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Balance</p>
                        <p className={`text-xl font-bold ${
                          isDark
                            ? account.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                            : account.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                        }`}>
                          {balanceVisible ? `₹${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Link 
                        href={`/banking/accounts/${account.id}`}
                        className={`text-sm font-medium ${
                          isDark
                            ? account.color === 'blue' ? 'text-blue-400 hover:text-blue-300' : 'text-purple-400 hover:text-purple-300'
                            : account.color === 'blue' ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'
                        }`}
                      >
                        View Details
                      </Link>
                      <Link 
                        href={`/banking/transfer?from=${account.id}`}
                        className={`text-sm font-medium ${
                          isDark
                            ? account.color === 'blue' ? 'text-blue-400 hover:text-blue-300' : 'text-purple-400 hover:text-purple-300'
                            : account.color === 'blue' ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'
                        }`}
                      >
                        Transfer
                      </Link>
                    </div>
                  </div>
                ))}
                
                <Link 
                  href="/banking/accounts/new" 
                  className={`block text-center p-3 border border-dashed rounded-lg ${
                    isDark
                      ? 'border-white/20 text-white/70 hover:bg-white/5'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >`2`
                  + Open a New Account
                </Link>
              </div>
            ) : (
              <div className={`p-8 text-center rounded-lg border border-dashed ${isDark ? 'border-white/20 text-white/70' : 'border-slate-300 text-slate-600'}`}>
                <p className="mb-4">You don&apos;t have any accounts yet</p>
                <Link 
                  href="/banking/accounts/new"
                  className={`inline-block px-4 py-2 rounded-md ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  Open Your First Account
                </Link>
              </div>
            )}
          </GlassCard>
          
          {/* Recent Transactions */}
          <GlassCard 
            intensity="light" 
            className={`p-4 mt-6 border ${isDark ? 'border-white/10' : 'border-slate-200'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Recent Transactions
              </h2>
              <Link 
                href="/banking/transactions" 
                className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                View All
              </Link>
            </div>
            
            {transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className={`p-3 rounded-lg ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                    } transition-colors flex justify-between items-center`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.amount > 0
                          ? isDark ? 'bg-green-500/20' : 'bg-green-100'
                          : isDark ? 'bg-red-500/20' : 'bg-red-100'
                      }`}>
                        <span className={
                          transaction.amount > 0
                            ? isDark ? 'text-green-400' : 'text-green-600'
                            : isDark ? 'text-red-400' : 'text-red-600'
                        }>
                          {getTransactionIcon(transaction.category, transaction.amount > 0, transaction.transactionType)}
                        </span>
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{transaction.name}</p>
                        <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                          {transaction.date} • {transaction.time}
                        </p>
                      </div>
                    </div>
                    <p className={`font-medium ${
                      transaction.amount > 0
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-6 text-center rounded-lg border border-dashed ${isDark ? 'border-white/20 text-white/70' : 'border-slate-300 text-slate-600'}`}>
                <p>No transactions yet</p>
              </div>
            )}
          </GlassCard>
        </div>
        
        {/* Sidebar with Todo and Insights */}
        <div className="space-y-6">
          <Todo />
          
          {/* Insights */}
          <GlassCard 
            intensity="light" 
            className={`p-4 border ${isDark ? 'border-white/10' : 'border-slate-200'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Financial Insights
              </h2>
              <Bell size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div 
                    key={insight.id}
                    className={`p-3 rounded-lg ${
                      isDark ? 'bg-slate-800/50 border border-white/5' : 'bg-white border border-slate-200'
                    }`}
                  >
                    <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {insight.title}
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-4 text-center ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                <p>No insights available yet</p>
              </div>
            )}
          </GlassCard>
          
          {/* Security Status */}
          <GlassCard 
            intensity="light" 
            className={`p-4 border ${isDark ? 'border-white/10' : 'border-slate-200'}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-full ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <ShieldCheck size={18} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
              </div>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Security Status
              </h2>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white/90'} border ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>Account Protection</p>
                <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                  Strong
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>Last Login</p>
                <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <Link 
                href="/banking/security" 
                className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Security Settings
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
} 