import Image from "next/image"
import Link from "next/link"

export default function NewsSection() {
  const newsItems = [
   {
  title: "CODM SCORES GOLD AT ALLG",
  category: "ARTICLE",
  date: "APRIL, 2025",
  image: "/acadarena-sharkies.jpg",
  excerpt:
    "Dive into the thrilling world of CODM as our team, managed by Zeth, scores gold at All G versus HAU, marking a major milestone in our esports journey.",
},

{
  title: "Tides of Triumph Season 2: Will it Happen Again in 2025?",
  category: "EVENT",
  date: "May 2025",
  image: "/tot-s2.jpg",
  excerpt:
    "Find out if Tides of Triumph Season 2 will make a comeback this year and what you can expect from this highly anticipated event.",
},

{
  title: "OPEN TRYOUTS BATCH 2",
  category: "EVENT",
  date: "June 2025",
  image: "/open-tryout-2.jpg",
  excerpt:
    "We're excited to announce the second batch of open tryouts this year, now open for CODM, Valorant, and MLBB. Join us in our mission to protect shark habitats worldwide while competing at the highest level.",
},
  ]

  return (
    <section className="py-20 bg-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">LATEST NEWS</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Stay updated with our latest product launches, conservation efforts, and shark-related news from around the
            world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <Link
              href="#"
              key={index}
              className="news-card bg-neutral-950 rounded-lg overflow-hidden transition-all duration-300 group"
            >
              <div className="relative h-48">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-shark-blue text-white text-xs font-bold px-2 py-1 rounded">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-2">{item.date}</p>
                <h3 className="text-xl font-bold mb-3 group-hover:text-shark-blue transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.excerpt}</p>
                <div className="flex items-center text-shark-teal font-medium">
                  <span>Read More</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="#"
            className="inline-flex justify-center items-center gap-x-2 text-center bg-transparent hover:bg-white/10 border border-white text-white font-medium rounded-md focus:outline-none transition py-3 px-6"
          >
            VIEW ALL NEWS
          </Link>
        </div>
      </div>
    </section>
  )
}
