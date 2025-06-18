"use client";
import Script from "next/script";
import "../../styles/variants.css";
import "../../globals.css";
import AdminLogin from "@/app/component/adminLogin";


export default function auth() {
  return (
   <div className="bg-light-100">
         
    <AdminLogin />
   
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