'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TulisArtikel() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [content, setContent] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/articles", {
      method: "POST",
      body: JSON.stringify({ title, description, imageUrl, content }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (res.ok) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 mt-10 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-700">Tulis Artikel Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Judul Artikel</label>
          <input
            type="text"
            placeholder="Masukkan judul"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring focus:ring-pink-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Deskripsi</label>
          <input
            type="text"
            placeholder="Masukkan deskripsi"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring focus:ring-pink-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">URL Gambar</label>
          <input
            type="url"
            placeholder="Masukan Link Gambar"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring focus:ring-pink-300"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Isi Artikel</label>
          <textarea
            placeholder="Masukkan isi artikel lengkap di sini..."
            className="w-full border border-gray-300 p-3 rounded h-40 resize-y focus:outline-none focus:ring focus:ring-pink-300"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white font-semibold py-3 rounded hover:bg-pink-700 transition"
        >
          Simpan & Terbitkan
        </button>
      </form>
    </div>
  )
}
