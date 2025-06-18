import { Poppins } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import SessionProviderWrapper from "./component/SessionProviderWrapper"

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] // include all weights
})

export const metadata = {
  title: "LSB Sharks Unlimited",
  description:
    "The 1st Campus Esports organization in Olongapo and Zambales. Lyceum of Subic Bay's Official Esports Student Organization!",
}


export default function RootLayout({ children }) {
  return (
    <html>
      <body className={poppins.className}>
      <SessionProviderWrapper>
        {children}
      </SessionProviderWrapper>
      </body>
    </html>
  );
}
