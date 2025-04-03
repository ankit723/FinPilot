import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
    
    // Get the loan with payments
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
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
    
    return NextResponse.json(loan);
  } catch (error) {
    console.error("Error fetching loan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { status } = body;
    
    // Validate loan status
    if (status && !["ACTIVE", "PAID", "OVERDUE", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid loan status" },
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
      },
    });
    
    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }
    
    // Check authorization - only employees/admins can update loan status
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (user?.role !== "EMPLOYEE" && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Update loan
    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: { status },
    });
    
    return NextResponse.json(updatedLoan);
  } catch (error) {
    console.error("Error updating loan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 