import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Helper function to generate account number
function generateAccountNumber() {
  // Generate a random 10-digit number
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Helper function to calculate interest rate based on tenure
function calculateInterestRate(tenureInMonths: number): number {
  // Indian FD rates typically increase with tenure length
  if (tenureInMonths < 3) return 3.5;
  if (tenureInMonths < 6) return 4.0;
  if (tenureInMonths < 12) return 5.0;
  if (tenureInMonths < 24) return 5.5;
  if (tenureInMonths < 36) return 6.0;
  if (tenureInMonths < 60) return 6.25;
  return 6.5; // 5+ years
}

// GET /api/banking/accounts - Get all accounts (admin/employee) or user's accounts
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // First find the user's customer profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: true,
      },
    });
    
    if (!user?.customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }
    
    // Get accounts for this customer
    const accounts = await prisma.account.findMany({
      where: {
        customerId: user.customer.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Mask account numbers for security before sending to client
    const maskedAccounts = accounts.map(account => ({
      ...account,
      accountNumber: maskAccountNumber(account.accountNumber),
    }));
    
    return NextResponse.json(maskedAccounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
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

// POST /api/banking/accounts - Create a new account
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    console.log("Account creation request body:", body);
    const { customerId, type, initialDeposit = 0 } = body;
    
    console.log("Parsed values:", { customerId, type, initialDeposit, typeType: typeof type });
    
    // Validate request
    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }
    
    if (!type) {
      return NextResponse.json({ error: "Account type is required" }, { status: 400 });
    }
    
    if (initialDeposit < 0) {
      return NextResponse.json({ error: "Initial deposit cannot be negative" }, { status: 400 });
    }
    
    // Check if valid account type
    if (type !== "SAVINGS" && type !== "CURRENT" && type !== "FIXED_DEPOSIT") {
      return NextResponse.json(
        { error: `Invalid account type: '${type}'. Expected 'SAVINGS', 'CURRENT', or 'FIXED_DEPOSIT'` },
        { status: 400 }
      );
    }
    
    // Check tenure for fixed deposits
    const { tenure } = body;
    if (type === "FIXED_DEPOSIT" && (!tenure || isNaN(Number(tenure)) || Number(tenure) < 1)) {
      return NextResponse.json(
        { error: "Tenure is required for Fixed Deposits and must be at least 1 month" },
        { status: 400 }
      );
    }
    
    // Check if user is employee/admin or the customer themself
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: true,
      },
    });
    
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    // Check authorization
    if (
      user?.role !== "EMPLOYEE" &&
      user?.role !== "ADMIN" &&
      user?.customer?.id !== customerId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Generate unique account number
    const accountNumber = generateAccountNumber();
    
    // Calculate maturity date for fixed deposits
    let maturityDate;
    if (type === "FIXED_DEPOSIT" && tenure) {
      const today = new Date();
      maturityDate = new Date(today);
      maturityDate.setMonth(today.getMonth() + Number(tenure));
    }
    
    // Create account
    const account = await prisma.account.create({
      data: {
        accountNumber,
        customerId,
        type,
        balance: initialDeposit,
        status: "ACTIVE",
        // Add additional fields for fixed deposits
        tenure: type === "FIXED_DEPOSIT" ? Number(tenure) : undefined,
        maturityDate: maturityDate,
        interestRate: type === "FIXED_DEPOSIT" ? calculateInterestRate(Number(tenure)) : undefined,
      },
    });
    
    // Create initial deposit transaction if amount > 0
    if (initialDeposit > 0) {
      await prisma.transaction.create({
        data: {
          accountId: account.id,
          type: "DEPOSIT",
          amount: initialDeposit,
          reference: `INIT-${Date.now()}`,
          description: "Initial deposit",
        },
      });
    }
    
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 