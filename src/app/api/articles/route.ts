import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, imageUrl, content } = body

  if (!title || !description || !content) {
    return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 })
  }

  try {
    const article = await prisma.article.create({
      data: {
        title,
        description,
        imageUrl,
        content,
        author: {
          connect: { email: session.user?.email! }
        }
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Gagal menulis artikel:", error)
    return NextResponse.json({ message: "Gagal menulis artikel" }, { status: 500 })
  }
}
