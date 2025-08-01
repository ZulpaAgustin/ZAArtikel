import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(articles);
}
