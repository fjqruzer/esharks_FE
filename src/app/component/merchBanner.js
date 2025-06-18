import Link from "next/link"

export default function MerchBanner() {
  return (
<div className="relative h-screen w-full overflow-hidden">
  {/* Video Background */}
  <div className="absolute inset-0 w-full h-full">
<img
  src="/merch-poster.png?height=1080&width=1920"
  alt="LSB Sharks Unlimited Gameplay"
  className="w-full h-full object-cover"
/>
  </div>

  {/* MERCH BANNER */}
  <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
    <div className="animate-fade-in max-w-3xl mx-auto pt-5">

   
      <div className="flex flex-col sm:flex-row justify-end">
    
      </div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</div>
  )
}
