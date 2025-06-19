"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Nav from "@/app/component/Nav"
import Footer from "@/app/component/Footer"
import Hero from "@/app/component/Hero"
import React from "react"
import NextAuth from "next-auth"

const IMAGE_BASE = "https://snipe-enhanced-hopefully.ngrok-free.app/storage/";

export default function ProductPage({ params }) {
  const { id } = React.use(params)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [token, setToken] = useState(null) 

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"))
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products/getAvailableProductById?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) {
          setError("Product not found")
        } else {
          const inventoryArr = Array.isArray(data.inventory) ? data.inventory : data.inventory ? [data.inventory] : [];
          const productObj = {
            id: data.ProductID,
            sku: data.SKU,
            name: data.Name,
            category: data.category?.Name || "Unknown",
            price: `₱${data.Price}`,
            originalPrice: data.OriginalPrice ? `₱${data.OriginalPrice}` : null,
            image: data.Image ? IMAGE_BASE + data.Image : "/file.svg?height=600&width=600",
            badge: data.Badge,
            description: data.Description,
            features: Array.isArray(data.features) ? data.features.map(f => f.Description) : [],
            sizes: inventoryArr.filter(i => i.IsAvailable === 1 && i.Quantity_In_Stock > 0).map(i => i.Size),
            stock: inventoryArr.filter(i => i.IsAvailable === 1 && i.Quantity_In_Stock > 0).map(i => i.Quantity_In_Stock),
          };
          console.log("DEBUG product:", productObj, data.inventory);
          setProduct(productObj);
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Product not found")
        setLoading(false)
      })
  }, [id])

  const handleAddToCart = async () => {
    if (
      product.category.toLowerCase() !== "accessories" &&
      !selectedSize
    ) return

    setAdded(true)

    const payload = {
      ProductID: product.id,
      Size: product.category.toLowerCase() === "accessories" ? null : selectedSize,
      Quantity: quantity,
    }

    try {
      const res = await fetch(`/api/addToCart/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.message === "Successfully Added to the Cart") {
        // Optionally handle cart state/UI here
        console.debug("DEBUG: Cart successfully updated. Cart data:", data.cart)
      } else {
        // Optionally handle error
        console.error("DEBUG: Add to Cart error:", data)
      }
    } catch (err) {
      // Optionally handle fetch error
      console.error("DEBUG: Add to Cart fetch error:", err)
    }

    setTimeout(() => setAdded(false), 9000)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50">
        <img
          src="/logo-black.PNG"
          alt="Loading..."
          className="w-100 animate-ping"
          style={{ animationDuration: "1s" }}
        />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Nav />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  // Only show strikethrough and save if originalPrice exists and is greater than price
  const showDiscount = product.originalPrice &&
    Number(product.originalPrice.replace("₱", "")) > Number(product.price.replace("₱", ""))

  const calculateSavings = () => {
    if (!showDiscount) return 0
    const original = Number.parseFloat(product.originalPrice.replace("₱", "").replace(",", ""))
    const current = Number.parseFloat(product.price.replace("₱", "").replace(",", ""))
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav highlightCart={added} />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/merch/category" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 ">{product.name}</h1>
                       {/* stock */}
            {product.stock && product.stock.length > 0 && (
              <div className="">
                {/* <h3 className="text-sm font-medium text-gray-900 mb-2"> Stock</h3> */}
              <p 
                className={`text-gray-600 ${
                  product.stock.reduce((sum, qty) => sum + qty, 0) <= 5
                    ? "text-red-500 font-semibold"
                    : ""
                }`}>
                {product.stock.reduce((sum, qty) => sum + qty, 0)} items left!
              </p>
              </div>
            )}
          

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-semibold mt-3 text-violet-900">{product.price}</span>
                {showDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 text-sm font-medium rounded">
                      Save {calculateSavings()}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Sizes */}
            {product.category.toLowerCase() !== "accessories" && product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Available Sizes</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border 
                        ${selectedSize === size
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-violet-50"}
                        transition`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}


            {/* Quantity Selector */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">Quantity:</span>
              <button
                type="button"
                className="px-3 py-2 rounded border-1 font-bold text-gray-700 hover:bg-violet-500 hover:border-white transition"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >-</button>
                <input
                type="number"
                min={1}
                max={3}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Math.min(3, Number(e.target.value))))}
                className="no-spinner w-12 h-10 text-center border rounded"
                />
              <button
                type="button"
                className="px-3 py-2 rounded border-1 font-bold text-gray-700 hover:bg-violet-500 hover:border-white transition"
                onClick={() => setQuantity(q => Math.min(3, q + 1))}
                disabled={quantity >= 3}
              >+</button>
            </div>

            {/* Add to Cart Button */}
            <button
              className={`w-full py-3 rounded-lg font-bold text-white text-lg transition
                ${added ? "bg-green-600" : "bg-violet-600 hover:bg-violet-700"}
                ${
                  product.category.toLowerCase() !== "accessories" && !selectedSize
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
              disabled={
                added ||
                (product.category.toLowerCase() !== "accessories" && !selectedSize)
              }
              onClick={handleAddToCart}
            >
              {added ? (
                <span className="flex items-center justify-center gap-2 animate-bounce transition duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* View Cart Button */}
            {added && (
              <Link
                href="/cart"
                className="block w-full mt-3 text-center py-2 rounded-lg bg-violet-100 text-violet-700 font-semibold hover:bg-violet-200 transition"
              >
                View your cart
              </Link>
            )}

            {/* Product Info */}
            <div className="text-sm text-gray-600">
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              
       
            </div>
          </div>
        </div>
        
        

        {/* Product Description & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-2">
              {(product.features || []).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
