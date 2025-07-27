'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ArtikelPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (status === "authenticated") {
      const fetchArticles = async () => {
        const res = await fetch("/api/my-articles")
        const data = await res.json()
        setArticles(data)
      }

      fetchArticles()
    }
  }, [status, router])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus artikel ini?")
    if (!confirmDelete) return

    const res = await fetch(`/api/articles/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">Artikel Saya</h1>

      {articles.length === 0 ? (
        <p className="text-gray-600">Belum ada artikel ditulis.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((article: any) => (
            <li
              key={article.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4"
            >
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full md:w-48 h-32 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-gray-600 mb-2">
                  {article.content.slice(0, 150)}...
                </p>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/artikel/edit/${article.id}`}
                    className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
