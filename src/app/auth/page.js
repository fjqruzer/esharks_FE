"use client";
import Script from "next/script";
import Nav from "../component/Nav";
import "../styles/variants.css";
import "../globals.css"
import Footer from "../component/Footer";
import LogInForm from "../component/LogInForm";


export default function auth() {
  return (
   <div className="bg-light-100">
         
    <LogInForm />
   
   <Script
        src="/preline.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.HS && window.HS.init) {
            window.HS.init();
          }
        }}
      />
       
    </div>
  );
}