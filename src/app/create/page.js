"use client";
import Script from "next/script";

import "../styles/variants.css";
import "../globals.css"
import CreateAccountForm from "../component/create.js";


export default function auth() {
  return (
   <div className="bg-light-100">
         
    <CreateAccountForm />
   
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