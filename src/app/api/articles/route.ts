import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, content, imageUrl } = body;

  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        description,
        content,
        imageUrl,
        author: {
          connect: { email: session.user.email },
        },
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
