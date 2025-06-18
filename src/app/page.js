"use client";
import Script from "next/script";
import Nav from "./component/Nav";
import "./styles/variants.css";
import Featured from "./component/Featured";
import Newsletter from "./component/newsletter";
import "./globals.css"
import Footer from "./component/Footer";
import FeaturedProducts from "./component/featuredProducts";
import NewsSection from "./component/NewsSection";
import FeaturedVideo from "./component/featuredVideo";


export default function Home() {
  return (
    <div className="bg-light-100 ">
          <Nav />
        <Featured />
        <FeaturedProducts />
        <FeaturedVideo />
        <NewsSection />
        <Newsletter />
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
