'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Home, FileText, PlusCircle, LogOut } from 'lucide-react'

export default function Sidebar() {
  const { data: session } = useSession()

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-pink-900 to-pink-700 text-white shadow-lg flex flex-col p-6">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-center">ZAArtikel</h2>
        <p className="text-sm text-pink-200 text-center mt-1">
          {session?.user?.name || session?.user?.email}
        </p>
      </div>

      <nav className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 hover:bg-pink-600 px-4 py-2 rounded transition"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link
          href="/dashboard/artikel"
          className="flex items-center gap-3 hover:bg-pink-600 px-4 py-2 rounded transition"
        >
          <FileText size={20} />
          <span>Artikel</span>
        </Link>

        <Link
          href="/dashboard/tulis"
          className="flex items-center gap-3 hover:bg-pink-600 px-4 py-2 rounded transition"
        >
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
