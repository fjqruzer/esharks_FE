"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import ProfileModal from "./ProfileModal"
import { CircleUser } from 'lucide-react';


export default function Nav() {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPillExpanded, setIsPillExpanded] = useState(true)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const navRef = useRef(null) 


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsPillExpanded(true)
        setIsMobileMenuOpen(false)
      }
    }
    if (isPillExpanded || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isPillExpanded, isMobileMenuOpen])

  return (
    <div>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-transparent" : "bg-transparent"}`}
      >
        <nav
          ref={navRef}
          className={`relative max-w-fit mx-auto px-4 py-2 mt-4 rounded-full transition-all duration-500 shadow-lg
            ${isScrolled ? "bg-neutral-400/80 backdrop-blur-md" : "bg-neutral-100/30 backdrop-blur-md"}
            ${isPillExpanded ? "w-[100%] md:w-auto" : "w-auto"}
            flex items-center justify-between`}
          aria-label="Global"
          onMouseEnter={() => window.innerWidth >= 800 && setIsPillExpanded(true)}
          onMouseLeave={() => window.innerWidth >= 800 && setIsPillExpanded(true)}
        >
          {/* Main Pill Content - Always Visible */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex-none ">
              <Image
                src="/logo-white.png"
                width={200}
                height={50}
                className="h-auto w-auto max-h-7"
                alt="logo"
              />
            </Link>

            {/* Hamburger/Close Icon for Mobile */}
            <div className="md:hidden">
              <button
                type="button"
                className="p-1 inline-flex justify-center items-center gap-2 rounded-full text-neutral-100 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Toggle navigation</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Profile Icon (conditionally rendered in pill) */}
            {status === "authenticated" && (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="p-1 rounded-full hover:bg-gray-800 transition text-white focus:outline-none md:hidden"
              >
               <CircleUser className="w-5 h-5" />
              </button>
            )}

            {/* Cart Icon (conditionally rendered in pill) */}
            <Link href="/cart" className={`p-1 rounded-full text-white hover:text-red-500 md:hidden ${typeof window !== "undefined" && window.location.pathname === '/cart' ? 'hidden' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FEFEFE" className="w-5 h-5">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                  <path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" stroke="currentColor" strokeWidth="1.5"></path>
                  <path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z" stroke="currentColor" strokeWidth="1.5"></path>
                  <path d="M11 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                  <path d="M5 6H16.4504C18.5054 6 19.5328 6 19.9775 6.67426C20.4221 7.34853 20.0173 8.29294 19.2078 10.1818L18.7792 11.1818C18.4013 12.0636 18.2123 12.5045 17.8366 12.7523C17.4609 13 16.9812 13 16.0218 13H5" stroke="currentColor" strokeWidth="1.5"></path>
                </g>
              </svg>
            </Link>
          </div>

          {/* Desktop Nav Items & Expanded Pill Content */}
          <div
            className={`hidden md:flex flex-grow items-center justify-end overflow-hidden transition-all duration-500
              ${isPillExpanded ? "max-w-full opacity-100" : "max-w-0 opacity-0"}`}
          >
            
            <div className="flex text-xs gap-3">
                  {status === "authenticated" && (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="font-bold text-white hover:text-red-500 flex items-center gap-2 px-2 py-1 rounded-full transition-colors"
                >
                <CircleUser className="w-4 h-4" />
                  <span>
                    {session?.user?.FirstName || session?.user?.email || "Profile"}
                  </span>
                </button>
              )}
              <Link href="/" className="font-bold text-white hover:text-red-500 px-2 py-1 rounded-full transition-colors">
                HOME
              </Link>
              <Link href="#" className="font-bold text-white hover:text-red-500 px-2 py-1 rounded-full transition-colors">
                NEWS
              </Link>
              <Link href="/merch" className="font-bold text-white hover:text-red-500 px-2 py-1 rounded-full transition-colors">
                MERCH
              </Link>
              <Link href="#" className="font-bold text-white hover:text-red-500 px-2 py-1 rounded-full transition-colors">
                ABOUT
              </Link>
              {status !== "authenticated" && (
                <Link href="/auth" className="font-bold text-white hover:text-red-500 flex items-center gap-1 px-2 rounded-full transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                LOG IN
                </Link>
              )}
          
              <Link href="/cart" className={`font-bold text-white hover:text-red-500 flex items-center gap-2 px-2 py-1 rounded-full transition-colors ${typeof window !== "undefined" && window.location.pathname === '/cart' ? 'hidden' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FEFEFE" className="w-4 h-4">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" stroke="currentColor" strokeWidth="1.5"></path>
                    <path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z" stroke="currentColor" strokeWidth="1.5"></path>
                    <path d="M11 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M5 6H16.4504C18.5054 6 19.5328 6 19.9775 6.67426C20.4221 7.34853 20.0173 8.29294 19.2078 10.1818L18.7792 11.1818C18.4013 12.0636 18.2123 12.5045 17.8366 12.7523C17.4609 13 16.9812 13 16.0218 13H5" stroke="currentColor" strokeWidth="1.5"></path>
                  </g>
                </svg>
                CART
              </Link>
            </div>
          </div>
        </nav>
                      {/* Mobile Expanded Menu (outside the pill for full width) */}
              <div
                className={`md:hidden overflow-hidden transition-all duration-300
                  ${isMobileMenuOpen ? "h-auto opacity-100 py-4 pointer-events-auto" : "h-0"}
                  bg-neutral-700/80 backdrop-blur-md w-full flex justify-center items-center text-center left-0 right-0 z-50`}
              >
                <div className="flex flex-col text-sm gap-3 px-4">
                  <Link
                    href="/"
                    className="font-bold text-white hover:text-red-500 py-2"
                  >
                    HOME
                  </Link>
                  <Link
                    href="#"
                    className="font-bold text-white hover:text-red-500 py-2"
                  >
                    NEWS
                  </Link>
                  <Link
                    href="/merch"
                    className="font-bold text-white hover:text-red-500 py-2"
                  >
                    MERCH
                  </Link>
                  <Link
                    href="#"
                    className="font-bold text-white hover:text-red-500 py-2"
                  >
                    ABOUT
                  </Link>
                  {status !== "authenticated" && (
                    <Link
                      href="/auth"
                      className="font-bold text-white hover:text-red-500 flex items-center gap-2 py-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      LOG IN
                    </Link>
                  )}
                </div>
              </div>
      </header>
      <div className="body-container">
        <ProfileModal
          user={session?.user || {}}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>
    </div>
  )
}