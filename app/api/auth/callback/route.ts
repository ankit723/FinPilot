import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

    const user = await currentUser();
    if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));

    // Check if user exists in DB
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { customer: true }
    });

    // New user - redirect to onboarding
    if (!existingUser) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Existing user without complete profile - redirect to onboarding
    if (!existingUser.customer) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Existing user with complete profile - redirect to banking dashboard
    return NextResponse.redirect(new URL("/banking/dashboard", req.url));
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(new URL("/error", req.url));
  }
}
