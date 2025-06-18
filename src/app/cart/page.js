"use client";
import Script from "next/script";
import Nav from "@/app/component/Nav";
import CartItem from "../component/cartItem";
import Footer from "@/app/component/Footer";
import Hero from "../component/Hero";
import CheckOutModal from "../component/checkoutModal";


export default function cart() {
  return (
   <div className="">
    <Nav />
    <Hero />
    <CartItem />
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