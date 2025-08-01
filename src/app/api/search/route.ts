import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  const articles = await prisma.article.findMany({
    where: {
      title: {
        contains: query || "",
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return NextResponse.json(articles);
}
