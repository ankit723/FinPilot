'use server'

import { auth } from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";

export async function getUserId() {
    const { userId } = await auth();
    return userId;
}

export async function getUser() {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }
    const user = await prisma.user.findUnique({
        where: {
        id: userId,
        },
    });
    return user;
}