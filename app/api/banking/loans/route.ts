import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Helper function to generate loan number
function generateLoanNumber() {
  return `LOAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// GET /api/banking/loans - Get all loans (admin/employee) or customer's loans
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // If admin/employee, get all loans
    if (user.role === "ADMIN" || user.role === "EMPLOYEE") {
      const loans = await prisma.loan.findMany({
        include: {
          customer: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          payments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      
      return NextResponse.json(loans);
    }
    
    // If customer, get only their loans
    if (!user.customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }
    
    const loans = await prisma.loan.findMany({
      where: {
        customerId: user.customer.id,
      },
      include: {
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/banking/loans - Apply for a new loan
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { customerId, amount, interest, term } = body;
    
    // Validate request
    if (!customerId || !amount || !interest || !term) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    if (amount <= 0 || interest <= 0 || term <= 0) {
      return NextResponse.json(
        { error: "Invalid values for amount, interest, or term" },
        { status: 400 }
      );
    }
    
    // Get the customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        user: true,
      },
    });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    // Check authorization - user must be the customer or an employee/admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    const isAuthorized =
      user?.role === "EMPLOYEE" ||
      user?.role === "ADMIN" ||
      customer.user.id === userId;
    
    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // If customer is applying, set status to PENDING, otherwise ACTIVE
    const status = user?.role === "EMPLOYEE" || user?.role === "ADMIN" ? "ACTIVE" : "PENDING";
    
    // Generate unique loan number
    const loanNumber = generateLoanNumber();
    
    // Create the loan
    const loan = await prisma.loan.create({
      data: {
        loanNumber,
        customerId,
        amount,
        interest,
        term,
        status,
      },
    });
    
    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    console.error("Error creating loan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 