import Link from "next/link";
import { prisma } from "../lib/prisma";
import { Article } from "@prisma/client";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function HomePage() {
  const articles: Article[] = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="w-full bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logozul.png"
              alt="logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-pink-700">ZAArtikel</span>
          </div>

          <div className="flex-1 mx-6 hidden md:block">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <span className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                Login
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📝 Artikel Terbaru
        </h1>

        {articles.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    Tidak ada gambar
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-pink-800 mb-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(article.createdAt)}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {article.content.slice(0, 120)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Belum ada artikel.</p>
        )}
      </section>
    </main>
  );
}
