
"use client";
import Script from "next/script";
import Nav from "@/app/component/Nav";
import Hero from "@/app/component/Hero";
import Footer from "@/app/component/Footer";
import ProductCard from "@/app/component/product-card";


export default function category() {
  return (
   <div className="">
    <Nav />
    <Hero />
    <div className="container mx-auto mt-10 mb-10">
    <div className="font-bold xl:text-6xl text-xl mt-3 mb-5">All Products</div>
  <ProductCard />
    </div>
  
   <Script
        src="/preline.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.HS && window.HS.init) {
            window.HS.init();
          }
        }}
      />
    <Footer />
    </div>
  );
}