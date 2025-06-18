import Link from "next/link"

export default function Featured() {
  return (
<div className="relative h-screen w-full overflow-hidden">
  {/* Video Background */}
  <div className="absolute inset-0 w-full h-full">
<img
  src="acadarena-sharkies.jpg?height=1080&width=1920"
  alt="LSB Sharks Unlimited Gameplay"
  className="w-full h-full object-cover brightness-40 blur-xs"
/>
  </div>

  {/* Hero Content */}
  <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
    <div className="animate-fade-in max-w-3xl mx-auto pt-5">
    <img src="logo-white.png" alt="Logo" className="size-50 mx-auto shark-logo"/>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
        LSB SHARKS UNLIMITED <span className="lsb-sharks"><br></br>E-SPORTS</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
        Representing Lyceum of Subic Bay in Zambales, we're a team of passionate gamers competing in various e-sports tournaments.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="#"
          className="inline-flex justify-center items-center gap-x-2 text-center bg-lsb-sharks-red hover:bg-red-700 border border-transparent text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-800 transition py-3 px-6 text-lg"
        >
          JOIN OUR TEAM
        </Link>
        <Link
          href="#"
          className="inline-flex justify-center items-center gap-x-2 text-center bg-transparent hover:bg-white/10 border border-white text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition py-3 px-6 text-lg"
        >
          LEARN MORE
        </Link>
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
