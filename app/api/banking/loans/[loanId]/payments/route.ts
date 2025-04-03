import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET /api/banking/loans/[loanId]/payments - Get payments for a specific loan
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ loanId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const params = await props.params;
    const { loanId } = params;
    
    // Get the loan
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
      },
    });
    
    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }
    
    // Check authorization - user must be loan owner or employee/admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (
      user?.role !== "EMPLOYEE" &&
      user?.role !== "ADMIN" &&
      loan.customer.user.id !== userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Get loan payments
    const payments = await prisma.loanPayment.findMany({
      where: { loanId },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching loan payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/banking/loans/[loanId]/payments - Make a loan payment
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ loanId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const params = await props.params;
    const { loanId } = params;
    const body = await req.json();
    const { amount } = body;
    
    // Validate request
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }
    
    // Get the loan
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        payments: true,
      },
    });
    
    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }
    
    // Check if loan is active
    if (loan.status !== "ACTIVE" && loan.status !== "OVERDUE") {
      return NextResponse.json(
        { error: "Cannot make payment on a non-active loan" },
        { status: 400 }
      );
    }
    
    // Check authorization - user must be loan owner or employee/admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (
      user?.role !== "EMPLOYEE" &&
      user?.role !== "ADMIN" &&
      loan.customer.user.id !== userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Calculate total amount paid so far
    const totalPaid = loan.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    
    // Calculate remaining amount
    const remainingAmount = loan.amount - totalPaid;
    
    // Ensure payment amount doesn't exceed remaining amount
    if (amount > remainingAmount) {
      return NextResponse.json(
        { 
          error: "Payment amount exceeds remaining loan balance",
          remainingAmount
        },
        { status: 400 }
      );
    }
    
    // Make payment
    const payment = await prisma.loanPayment.create({
      data: {
        loanId,
        amount,
        dueDate: new Date(),
      },
    });
    
    // Check if loan is fully paid
    const newTotalPaid = totalPaid + amount;
    if (newTotalPaid >= loan.amount) {
      await prisma.loan.update({
        where: { id: loanId },
        data: { status: "PAID" },
      });
    }
    
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Error making loan payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 