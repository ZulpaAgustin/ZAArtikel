import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File;

  console.log("File dari formData:", file)

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(process.cwd(), "public/uploads", filename);

  await writeFile(uploadPath, buffer);

  const imageUrl = `/uploads/${filename}`;

  await prisma.user.update({
    where: { email: session.user.email },
    data: { image: imageUrl },
  });

  return NextResponse.json({ success: true, imageUrl });
}
