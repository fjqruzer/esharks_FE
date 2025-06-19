"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, UsersIcon, ShoppingBagIcon, BarChartIcon, Warehouse, ScanBarcode, ChartBarStacked, Gem as ChartBarIcon, CogIcon, LogOutIcon, MenuIcon, XIcon, WarehouseIcon, ScanBarcodeIcon, ChartBarStackedIcon, GemIcon } from "lucide-react"

const navigation = [
  // { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Accounts", href: "/accounts", icon: UsersIcon },
  { name: "Categories", href: "/categories", icon: ChartBarStackedIcon },
  { name: "Products", href: "/products", icon: ScanBarcodeIcon },
  { name: "Features", href: "/features", icon: GemIcon },
  { name: "Inventory", href: "/inventory", icon: WarehouseIcon },
  { name: "Orders", href: "/orders", icon: ShoppingBagIcon },
  { name: "Analytics", href: "/reports", icon: BarChartIcon },
  // { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    // Get token from localStorage and fetch session if needed
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      setAdminEmail(session?.user?.email || "");
      setAdminName(session?.user?.FirstName || "");
    };
    fetchSession();
  }, []);

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 p-2 rounded"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <MenuIcon className="w-6 h-6 text-white" />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-neutral-900 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 z-40 transform transition duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <XIcon className="w-6 h-6 text-white" />
        </button>
        
        <div className="text-white flex items-center space-x-2 px-4">
          <img src="/logo-white.png" width="50px" alt="Logo" />
          <div className="text-white font-bold">
            {adminName ? `Welcome, ${adminName}!` : "Hello admin"}
          </div>
        </div>
        <nav className="space-y-2 text-xs">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setOpen(false)} // Close sidebar on link click (mobile)
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition duration-200">
            <LogOutIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}