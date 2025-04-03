import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Helper function to generate transaction reference
function generateTransactionReference() {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// GET /api/banking/transactions - Get all transactions for a user's accounts
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const accountId = url.searchParams.get('accountId');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // Find the user's customer profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          include: {
            accounts: true
          }
        },
      },
    });

    if (!user?.customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }

    // If accountId is specified, verify the account belongs to this customer
    if (accountId) {
      const accountBelongsToCustomer = user.customer.accounts.some(
        account => account.id === accountId
      );
      
      if (!accountBelongsToCustomer) {
        return NextResponse.json(
          { error: "Account not found or does not belong to this customer" },
          { status: 403 }
        );
      }
    }

    // Build the transaction query
    const whereClause: any = {};
    
    // Filter by accountId or all customer accounts
    if (accountId) {
      whereClause.accountId = accountId;
    } else {
      // Get transactions for all of the customer's accounts
      const accountIds = user.customer.accounts.map(account => account.id);
      whereClause.accountId = {
        in: accountIds
      };
    }

    // Get transactions with the specified filters
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        account: true,
      },
    });

    // Process transactions to make them more user-friendly
    const processedTransactions = transactions.map(tx => {
      // Determine if this is incoming or outgoing based on transaction type
      const isOutgoing = tx.type === 'WITHDRAWAL' || (tx.type === 'TRANSFER' && tx.description?.includes('to'));
      
      // Format the transaction display amount based on transaction type
      const amount = isOutgoing ? -tx.amount : tx.amount;
      
      // Create a descriptive name for the transaction
      let name = tx.description || 'Transaction';
      if (!name) {
        if (tx.type === 'DEPOSIT') name = 'Deposit';
        else if (tx.type === 'WITHDRAWAL') name = 'Withdrawal';
        else if (tx.type === 'TRANSFER') {
          const accountNumber = tx.account?.accountNumber || '';
          name = `Transfer ${tx.amount > 0 ? 'to' : 'from'} ${maskAccountNumber(accountNumber)}`;
        }
      }

      return {
        id: tx.id,
        name,
        amount,
        createdAt: tx.createdAt,
        // Infer category from transaction type
        category: tx.type === 'DEPOSIT' ? 'Income' : 
                 tx.type === 'WITHDRAWAL' ? 'Expense' : 'Transfer',
        status: 'COMPLETED', // Default status since there's no status in Transaction model
        transactionType: tx.type,
      };
    });

    return NextResponse.json(processedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// Helper function to mask account number
function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber) return "****";
  
  // Keep first and last 2 digits, mask the rest
  if (accountNumber.length <= 4) {
    return accountNumber;
  }
  
  const firstTwoDigits = accountNumber.substring(0, 2);
  const lastTwoDigits = accountNumber.substring(accountNumber.length - 2);
  const maskedLength = accountNumber.length - 4;
  const maskedPart = "*".repeat(maskedLength);
  
  return `${firstTwoDigits}${maskedPart}${lastTwoDigits}`;
}

// POST /api/banking/transactions - Create a new transaction
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { accountId, type, amount, description } = body;
    
    // Validate request
    if (!accountId || !type || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }
    
    // Check if valid transaction type
    if (!["DEPOSIT", "WITHDRAWAL", "TRANSFER"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }
    
    // Get the account
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
      },
    });
    
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    
    // Check account status
    if (account.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 400 }
      );
    }
    
    // Check authorization - user must be the account owner or an employee/admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (
      user?.role !== "EMPLOYEE" &&
      user?.role !== "ADMIN" &&
      account.customer.user.id !== userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Check sufficient balance for withdrawals
    if (type === "WITHDRAWAL" && account.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }
    
    // Begin transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update account balance
      let newBalance = account.balance;
      
      if (type === "DEPOSIT") {
        newBalance += amount;
      } else if (type === "WITHDRAWAL") {
        newBalance -= amount;
      }
      
      // Update account balance
      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      });
      
      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          accountId,
          type,
          amount,
          description,
          reference: generateTransactionReference(),
        },
      });
      
      return { transaction, updatedAccount };
    });
    
    return NextResponse.json(result.transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 