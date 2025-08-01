'use client'

import { useEffect, useState } from 'react'

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${query}`)
      const data = await res.json()
      setResults(data)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <button className="float-right text-red-500" onClick={onClose}>✖</button>
        <h2 className="text-lg font-semibold mb-4">Cari Artikel</h2>
        <input
          type="text"
          className="w-full border px-4 py-2 mb-4 rounded"
          placeholder="Ketik judul artikel..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {results.map((item: any) => (
            <li key={item.id} className="text-sm text-pink-700 font-medium">
              <a href={`/artikel/${item.id}`}>{item.title}</a>
            </li>
          ))}
          {query && results.length === 0 && (
            <li className="text-sm text-gray-500">Tidak ditemukan.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
