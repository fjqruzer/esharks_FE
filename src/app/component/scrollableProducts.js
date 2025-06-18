import Image from "next/image"
import Link from "next/link"

export default function ScrollableProducts({ products, getBadgeColor }) {
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
    <div className="py-20 bg-gradient-to-b from-neutral-950 to-stone-800">
      <h2 className="text-2xl font-bold text-white-900 mb-6 text-center">HOT MERCH 🔥</h2>
      <div className="scroll-container flex overflow-x-auto space-x-6 justify-start md:justify-center scroll-smooth">
       
{products.map((product, index) => (
  <div
    key={index}
    className="product-card group rounded-lg flex-none w-60  bg-slate-950 overflow-hidden relative"
  >
    <div className="relative">
      <Image
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        width={400}
        height={600}
        className="w-full h-[300px] object-cover object-center transition-transform duration-1000 group-hover:scale-100 group-hover:blur-xs"
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

    {/* Overlay only on hover of this card */}
    <div className="product-overlay absolute inset-0 bg-shark-blue/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="text-center w-full px-4">
        <button className="bg-stone-900 text-shark-blue hover:bg-red-500 py-2 px-6 rounded-md font-medium mb-2 block w-full">
          ADD TO CART
        </button>
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
}
