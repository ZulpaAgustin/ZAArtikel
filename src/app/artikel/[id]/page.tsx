import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export async function generateMetadata(
  props: Promise<{ params: { id: string } }>
) {
  const { params } = await props
  const article = await prisma.article.findUnique({ where: { id: params.id } })
  if (!article) return {}
  return {
    title: article.title,
    description: article.content.slice(0, 160),
  }
}

export default async function ArtikelDetail(
  props: Promise<{ params: { id: string } }>
) {
  const { params } = await props

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { author: true },
  })

  if (!article) return notFound()

  const recentArticles = await prisma.article.findMany({
    where: { id: { not: article.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const date = new Date(article.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="container mx-auto p-6 grid lg:grid-cols-[1fr_300px] gap-10">
      <article className="bg-white rounded-xl shadow p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={article.author?.image || '/images/default-avatar.jpg'}
              alt={article.author?.name || 'Author'}
              width={50}
              height={50}
              className="rounded-full object-cover w-[50px] h-[50px]"
            />
            <div>
              <h4 className="text-sm font-medium">
                {article.author?.name || 'Penulis'}
              </h4>
              <p className="text-gray-500 text-xs">{date}</p>
            </div>
          </div>
          {article.imageUrl && (
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={1200}
              height={600}
              className="rounded-lg w-full h-[300px] object-cover"
            />
          )}
        </header>

        <section className="prose prose-lg max-w-none">
          {article.content.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      </article>

      <aside className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4 border-b pb-2 border-pink-500">
            Artikel Terbaru
          </h3>
          <ul className="space-y-4">
            {recentArticles.map((recent) => {
              const recentDate = new Date(recent.createdAt).toLocaleDateString(
                'id-ID',
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }
              )

              return (
                <li className="flex gap-3" key={recent.id}>
                  <Image
                    src={recent.imageUrl || '/images/default-thumbnail.jpg'}
                    alt={recent.title}
                    width={100}
                    height={80}
                    className="rounded w-[100px] h-[80px] object-cover"
                  />
                  <div>
                    <a href={`/artikel/${recent.id}`}>
                      <h4 className="text-sm font-semibold leading-tight hover:text-pink-600">
                        {recent.title}
                      </h4>
                    </a>
                    <p className="text-xs text-gray-500">{recentDate}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </main>
  )
}
