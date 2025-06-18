"use client";
import Script from "next/script";
import Nav from "../component/Nav";
import "../styles/variants.css";
import "../globals.css"
import ForgotPasswordForm from "../component/ForgotPassword";


export default function auth() {
  return (
   <div className="bg-light-100">
    <ForgotPasswordForm />
   
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