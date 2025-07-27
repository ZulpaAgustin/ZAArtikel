import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, password } = body

  const userExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userExists) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  })

  return NextResponse.json(user, { status: 201 })
}
