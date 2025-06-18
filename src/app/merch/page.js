"use client";
import Script from "next/script";
import Nav from "../component/Nav";
import "../styles/variants.css";
import "../globals.css"
import Footer from "../component/Footer";
import MerchBanner from "../component/merchBanner";
import ScrollableProducts from "../component/scrollableProducts";
import CategorySection from "../component/CategorySection";

export default function auth() {
  return (
   <div className="bg-light-100">
    <Nav />
    <MerchBanner />
    <ScrollableProducts />
    <CategorySection />

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