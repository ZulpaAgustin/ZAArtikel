'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Home, FileText, PlusCircle, LogOut, Pencil, LucideHome, Globe } from 'lucide-react'
import { useRef, useState } from 'react'
import Image from 'next/image'
import DashboardHomePage from '@/app/home/page'

export default function Sidebar() {
  const { data: session, update } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setLoading(true)

    try {
      const res = await fetch('/api/upload-profile', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      if (result.success) {
        await update()
      }
    } catch (err) {
      console.error('Upload gagal:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-pink-900 to-pink-700 text-white shadow-lg flex flex-col p-6">
      <div className="mb-10 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <Image
            src={session?.user?.image || "/default-avatar.jpg"}
            alt="User profile"
            fill
            className="rounded-full object-cover border-4 border-white"
          />
          <button
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 bg-white text-pink-700 p-1 rounded-full hover:bg-pink-200"
            title="Ganti foto"
          >
            <Pencil size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <h2 className="text-xl font-bold">{session?.user?.name || session?.user?.email}</h2>
        {loading && <p className="text-sm mt-1 text-gray-300">Mengunggah...</p>}
      </div>

      <nav className="flex flex-col gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 hover:bg-pink-600 px-4 py-2 rounded transition">
          <Globe size={20} />
          <span>Dashboard</span>
        </Link>

        <Link href="/home" className="flex items-center gap-3 hover:bg-pink-600 px-4 py-2 rounded transition">
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link href="/dashboard/artikel" className="flex items-center gap-3 hover:bg-pink-600 px-4 py-2 rounded transition">
          <FileText size={20} />
          <span>Artikel</span>
        </Link>

        <Link href="/dashboard/tulis" className="flex items-center gap-3 hover:bg-pink-600 px-4 py-2 rounded transition">
          <PlusCircle size={20} />
          <span>Tulis Artikel</span>
        </Link>
      </nav>

      {session && (
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition text-white"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      )}
    </div>
  )
}
