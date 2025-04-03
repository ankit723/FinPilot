import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET /api/banking/customers - Get all customers (employee access only)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (user?.role !== "EMPLOYEE" && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const customers = await prisma.customer.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/banking/customers - Create a customer profile for a user
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { 
      phone, 
      address, 
      city, 
      state, 
      zipCode, 
      country, 
      employmentStatus, 
      annualIncome, 
      additionalInfo 
    } = body;
    
    // Check if customer already exists for this user
    const existingCustomer = await prisma.customer.findFirst({
      where: { userId },
    });
    
    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer profile already exists" },
        { status: 400 }
      );
    }

    // Parse annualIncome to float if provided
    const parsedAnnualIncome = annualIncome ? parseFloat(annualIncome) : undefined;
    
    // Create new customer profile
    const customer = await prisma.customer.create({
      data: {
        userId,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        employmentStatus: employmentStatus || undefined,
        annualIncome: parsedAnnualIncome,
        additionalInfo,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 