"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import { Article } from "@prisma/client";
import LeftNavbar from "@/components/LeftNavbar";

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error("Gagal mengambil artikel:", error);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Gagal mencari artikel:", error);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleSearchSubmit = async (keyword?: string) => {
    const query = keyword ?? search;
    setSearch(query);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setArticles(data);
      setShowDropdown(false);
    } catch (error) {
      console.error("Gagal saat pencarian:", error);
    }
  };

  return (
    <main className="min-h-screen flex bg-gray-50">
      <LeftNavbar />

      <div className="flex-1 ml-16">
        <nav className="w-full bg-white shadow sticky top-0 z-40">
          <div className="max-w-6xl mx-auto py-4 flex items-center justify-between">
            <h4 className="px-5 text-pink-600 font-semibold">ZAArtikel</h4>

            <div className="flex-1 relative" id="search">
              <input
                type="text"
                placeholder="Cari artikel..."
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              {showDropdown && results.length > 0 && (
                <div
                  className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-md z-50"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {results.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleSearchSubmit(article.title)}
                      className="w-full text-left px-4 py-2 hover:bg-pink-100 text-gray-800"
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-4">
              <Link href="/login">
                <span className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                  Login
                </span>
              </Link>
            </div>
          </div>
        </nav>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <Carousel />
          <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-6 text-center">
            📝 Artikel Terbaru
          </h1>

          {articles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/artikel/${article.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
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
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">Belum ada artikel.</p>
          )}
        </section>
      </div>
    </main>
  );
}
