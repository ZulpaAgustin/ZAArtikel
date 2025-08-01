import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions' // perbaiki path-nya

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  })

  if (!article) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(article)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, content, imageUrl } = body

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { author: true },
  })

  if (!article || article.author?.email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden or Not Found' }, { status: 403 })
  }

  const updated = await prisma.article.update({
    where: { id: params.id },
    data: { title, content, imageUrl },
  })

  return NextResponse.json(updated)
}
