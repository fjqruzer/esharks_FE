import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


const IMAGE_BASE = "https://snipe-enhanced-hopefully.ngrok-free.app/storage/";


const getBadgeVariant = (badge) => {
  switch (badge?.toLowerCase()) {
    case "limited edition":
      return "bg-purple-600 text-white";
    case "special offer":
      return "bg-orange-500 text-white";
    case "sale":
      return "bg-green-600 text-white";
    case "new":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white">
      <Link href={`/merch/category/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.badge && (
            <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded text-xs font-bold ${getBadgeVariant(product.badge)}`}>
              {product.badge}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1">
            <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</p>
          </div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[1rem]">{product.name}</h3>
           <p className="text-xs text-gray-500  truncate">{product.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{product.price}</span>
            {product.originalPrice &&
              Number(product.originalPrice.replace("₱", "").replace(",", "")) >
                Number(product.price.replace("₱", "").replace(",", "")) && (
                <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
              )
            }
          </div>
          {product.originalPrice &&
            Number(product.originalPrice.replace("₱", "").replace(",", "")) >
              Number(product.price.replace("₱", "").replace(",", "")) && (
              <div className="mt-1">
                <span className="text-sm text-green-600 font-medium">
                  Save{" "}
                  {(
                    ((Number(product.originalPrice.replace("₱", "").replace(",", "")) -
                      Number(product.price.replace("₱", "").replace(",", ""))) /
                      Number(product.originalPrice.replace("₱", "").replace(",", ""))) *
                    100
                  ).toFixed(0)}
                  %
                </span>
              </div>
            )
          }
        </div>
      </Link>
    </div>
  );
}

export default function ProductCardList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products/getAvailableProducts")
      .then((res) => res.json())
      .then((data) => {
        // Map backend fields to frontend fields
        setProducts(
          data.map((p) => ({
            id: p.ProductID,
            name: p.Name,
            description: p.Description,
            category: p.CategoryID === 1 ? "Apparel" : "Other", 
            price: `₱${p.Price}`,
            originalPrice: p.OriginalPrice ? `₱${p.OriginalPrice}` : null,
            image: p.Image ? IMAGE_BASE + p.Image : "/file.svg?height=300&width=300",
            badge: p.Badge,
            href: null,
          }))
        );
      });
  }, []);

  return (
    <div className="m-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product, idx) => (
        <ProductCard key={idx} product={product} />
      ))}
    </div>
  );
}