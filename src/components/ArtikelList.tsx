'use client'

import Link from "next/link"

interface Article {
  id: string
  title: string
  content: string
  imageUrl?: string | null
}

export default function ArtikelList({ articles }: { articles: Article[] }) {
  const handleDelete = (e: React.FormEvent, articleId: string) => {
    const confirmed = confirm("Yakin ingin menghapus artikel ini?")
    if (!confirmed) e.preventDefault()
  }

  return (
    <ul className="space-y-6">
      {articles.map((article) => (
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
              <form
                action={`/dashboard/artikel/delete/${article.id}`}
                method="POST"
                onSubmit={(e) => handleDelete(e, article.id)}
              >
                <button
                  type="submit"
                  className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                >
                  Hapus
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
