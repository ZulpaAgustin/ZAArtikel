import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = props.params;

  const article = await prisma.article.findUnique({
    where: { id },
  });

  return {
    title: article?.title || "Artikel tidak ditemukan",
  };
}

export default async function Page(props: PageProps) {
  const { id } = props.params;

  const session = await getServerSession(authOptions);

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) return notFound();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
    </div>
  );
}
