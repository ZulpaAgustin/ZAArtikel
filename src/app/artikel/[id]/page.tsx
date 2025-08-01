import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/prisma';
import { notFound } from "next/navigation";
import { Metadata } from "next";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });

  return {
    title: article?.title || "Artikel tidak ditemukan",
  };
}

export default async function Page({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });

  if (!article) return notFound();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
    </div>
  );
}
