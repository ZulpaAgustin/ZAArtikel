import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/authOptions'
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 })
  }

  const articles = await prisma.article.findMany({
    where: { author: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(articles)
}
