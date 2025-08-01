import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 })
  }

  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(article)
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 })
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, content, imageUrl } = body

  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true },
  })

  if (article?.author?.email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.article.update({
    where: { id },
    data: { title, content, imageUrl },
  })

  return NextResponse.json(updated)
}
