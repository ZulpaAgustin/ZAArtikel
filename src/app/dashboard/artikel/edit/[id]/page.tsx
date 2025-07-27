'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditArtikelPage() {
  const router = useRouter()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`/api/articles/${id}`)
      const data = await res.json()
      setTitle(data.title)
      setContent(data.content)
      setImageUrl(data.imageUrl || '')
      setLoading(false)
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, imageUrl }),
    })

    if (res.ok) {
      router.push('/dashboard/artikel')
    } else {
      alert('Gagal mengupdate artikel.')
    }
  }

  if (loading) return <p className="text-center mt-10">Loading artikel...</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">Edit Artikel</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Judul</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Gambar (URL)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Isi Artikel</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded h-40"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}
