"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  PencilLine,
  User,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

export default function LeftNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleProtectedRoute = (path: string) => {
    if (!session) {
      setShowPopup(true);
    } else {
      router.push(path);
    }
  };

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-16 bg-white border-r shadow flex flex-col items-center py-4 z-50">
        <Link href="/" className="mb-8">
          <img
            src="/images/logozul.png"
            alt="logo"
            className="w-10 h-10 rounded-full object-cover"
            title="ZAArtikel"
          />
        </Link>

        <nav className="flex flex-col gap-6">
          <Link
            href="/"
            className={`p-2 rounded-md hover:bg-pink-100 ${
              pathname === "/" ? "bg-pink-200" : ""
            }`}
            title="Beranda"
          >
            <Home size={24} />
          </Link>

          <button
            onClick={() => handleProtectedRoute("/dashboard/tulis")}
            className="p-2 rounded-md hover:bg-pink-100 mt-10"
            title="Tulis Artikel"
          >
            <PencilLine size={24} />
          </button>

          <button
            onClick={() => handleProtectedRoute("/dashboard/artikel")}
            className="p-2 rounded-md hover:bg-pink-100"
            title="Artikel Saya"
          >
            <BookOpen size={24} />
          </button>

          <button
            onClick={() => handleProtectedRoute("/dashboard")}
            className="p-2 rounded-md hover:bg-pink-100"
            title="Profil"
          >
            <User size={24} />
          </button>
        </nav>
      </aside>

      {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="bg-pink-100 text-pink-600 rounded-full p-3 mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M5.07 19h13.86c1.14 0 1.94-1.15 1.53-2.22l-6.93-15.13a1.5 1.5 0 00-2.74 0L3.54 16.78c-.41 1.07.39 2.22 1.53 2.22z"
            />
          </svg>
        </div>

        <p className="text-lg font-semibold text-gray-800 mb-2">
          Login Diperlukan
        </p>
        <p className="text-gray-600 mb-6 text-sm">
          Kamu harus login terlebih dahulu untuk mengakses halaman ini.
        </p>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => setShowPopup(false)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition text-gray-700"
          >
            Batal
          </button>
          <Link href="/login" className="w-full">
            <span className="block w-full text-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition">
              Login
            </span>
          </Link>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}
