import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const articles = await prisma.article.findMany({
    where: { author: { email: session.user?.email || "" } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-pink-700 mb-2">Penulis Artikel</h1>
      <p className="text-gray-600 mb-8">
        Selamat datang, <span className="font-medium">{session.user?.name || session.user?.email}</span>!
      </p>

      {articles.length === 0 ? (
        <div className="text-center text-gray-500">
          Kamu belum menerbitkan artikel.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition"
            >
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-40"
                />
              ) : (
                <div className="bg-gray-200 w-full h-40 flex items-center justify-center text-gray-500 text-sm">
                  Tidak ada gambar
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-bold mb-1 text-pink-800">{article.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  {article.content.slice(0, 100)}...
                </p>
                <p className="text-sm text-gray-400 italic">
                  Diterbitkan pada {formatDate(article.createdAt.toString())}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
