import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            where: { isPublished: true },
            include: {
                instructor: {
                    select: { name: true, image: true },
                },
                category: true,
                _count: {
                    select: { sections: true },
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}
