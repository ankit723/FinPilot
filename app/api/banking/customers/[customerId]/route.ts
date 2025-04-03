import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ customerId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const params = await props.params;
    const { customerId } = params;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    // Check if user is employee/admin or accessing their own profile
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        user: {
          select: {
            id: true, 
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        accounts: true,
        loans: true,
      },
    });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    // Allow access if user is employee/admin or it's their own profile
    if (user?.role !== "EMPLOYEE" && user?.role !== "ADMIN" && customer.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ customerId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const params = await props.params;
    const { customerId } = params;
    
    // Check if this customer exists and belongs to the authenticated user
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    // Allow access if user is employee/admin or it's their own profile
    if (user?.role !== "EMPLOYEE" && user?.role !== "ADMIN" && customer.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    
    // Parse annualIncome to float if provided
    const parsedAnnualIncome = annualIncome ? parseFloat(annualIncome) : undefined;
    
    // Update customer profile
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
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
    
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 