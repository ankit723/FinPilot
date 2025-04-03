import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ accountId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const params = await props.params;
    const { accountId } = params;
    
    // Get the account with transactions
    const account = await prisma.account.findUnique({
      where: { id: accountId },
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
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
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
    
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ accountId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const params = await props.params;
    const { accountId } = params;
    const body = await req.json();
    const { status } = body;
    
    // Validate status
    if (status && !["ACTIVE", "CLOSED", "SUSPENDED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid account status" },
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
    
    // Check authorization - only employees/admins can change account status
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (user?.role !== "EMPLOYEE" && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Update account
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: { status },
    });
    
    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 