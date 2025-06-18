import Image from "next/image"
import Link from "next/link"


export default function FeaturedProducts({ products, getBadgeColor }) {
  const defaultProducts = [
 
    {
      name: "LIMITED EDITION SHINAMI",
      category: "Collectibles",
      price: "₱1,499.99",
      originalPrice: "₱2,000.00",
      image: "/shinami.jpg",
      badge: "LIMITED",
    },
    {
      name: "SHARKS UNLIMITED LANYARD (2025)",
      category: "Apparel",
      price: "₱500.00",
      originalPrice: null,
      image: "/lanyard.png",
      badge: "NEW",
    },
  ];

  const defaultGetBadgeColor = (badge) => {
    switch (badge) {
      case "BESTSELLER":
        return "bg-yellow-600";
      case "NEW":
        return "bg-green-600";
      case "LIMITED":
        return "bg-purple-600";
      case "SALE":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  products = products || defaultProducts;
  getBadgeColor = getBadgeColor || defaultGetBadgeColor;


  return (
    <section className="py-20 bg-gradient-to-b from-neutral-950 to-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">FEATURED MERCH</h2>
<p className="text-lg text-gray-400 max-w-3xl mx-auto">
  Discover our e-sports themed merchandise and rep your favorite game with style.
</p>
        </div>
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {products.map((product, index) => (
            <div key={index} className="product-card relative overflow-hidden rounded-lg group bg-slate-700 ">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={600}
                  className="w-full h-[300px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <div
                    className={`absolute top-3 left-3 ${getBadgeColor(product.badge)} text-white text-xs font-bold px-2 py-1 rounded`}
                  >
                    {product.badge}
                  </div>
                )}
                <div className="absolute top-3 right-3 z-1">
                  <button className="bg-black/50 hover:bg-black/100 text-white p-2 rounded-full transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold shark-blue">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="product-overlay absolute inset-0 bg-shark-blue/90 flex items-center justify-center opacity-0 transition-opacity duration-300">
                <div className="text-center">
                  <button className="bg-stone-900 text-shark-blue hover:bg-red-500 py-2 px-6 rounded-md font-medium mb-2 block w-full">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/merch"
            className="inline-flex justify-center items-center gap-x-2 text-center bg-transparent hover:bg-white/10 border border-white text-white font-medium rounded-md focus:outline-none transition py-3 px-6"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  )
}
