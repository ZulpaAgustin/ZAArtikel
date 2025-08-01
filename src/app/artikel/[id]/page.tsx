import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(
  props: { params: { id: string } }
): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { id: props.params.id },
  });

  return {
    title: article?.title || "Artikel tidak ditemukan",
  };
}

export default async function Page(
  props: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  const article = await prisma.article.findUnique({
    where: { id: props.params.id },
  });

  if (!article) return notFound();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
    </div>
  );
}
