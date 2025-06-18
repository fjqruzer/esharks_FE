import Image from "next/image";
import Link from "next/link";

const categories = [
{
  name: "All",
  image: "/logo-white.png",
  href: "/merch/category",
  description: "View all merchandise",
},
  {
    name: "Apparel",
    image: "/og-jersey.jpeg",
    href: "/merch/category/apparel",
    description: "Jerseys, shirts, and more",
  },
  {
    name: "Collectibles",
    image: "/shinami.jpg",
    href: "/merch/category/collectibles",
    description: "Limited edition items",
  },
  {
    name: "Accessories",
    image: "/phone-holder.jpg",
    href: "/merch/category/accessories",
    description: "Lanyards, holders, and more",
  },
];

export default function CategorySection() {
  return (
    <div className="py-20 bg-gradient-to-b from-neutral-950 to-stone-800">
      <h2 className="text-2xl font-bold text-white mb-10 text-center">Shop by Category</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat, idx) => (
          <Link
            href={cat.href}
            key={idx}
            className="group w-64 bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow relative flex flex-col"
          >
            <div className="relative h-48 w-full">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 256px"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-300">{cat.description}</p>
              </div>
              <span className="mt-4 inline-block text-blue-400 group-hover:underline text-sm font-medium">
                Shop now &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}