"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingBag, User, Menu, X, ChevronDown, Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

const categories = [
  {
    name: "Men",
    subcategories: ["Running", "Basketball", "Casual", "Skateboarding", "Training"],
  },
  {
    name: "Women",
    subcategories: ["Running", "Lifestyle", "Training", "Tennis", "Walking"],
  },
  {
    name: "Kids",
    subcategories: ["Boys", "Girls", "Toddler", "School", "Sports"],
  },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { session, status, signOut } = useAuth()

  return (
    <header className="relative z-50">
      <div className="glass-panel mx-4 my-4 md:mx-8 md:my-6">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gradient">KickVerse</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                <DropdownMenu key={category.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 text-white/80 hover:text-white">
                      <span>{category.name}</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-panel border-none w-48">
                    {category.subcategories.map((subcategory) => (
                      <DropdownMenuItem
                        key={subcategory}
                        className="text-white/80 hover:text-white focus:text-white focus:bg-white/10"
                      >
                        <Link
                          href={`/products/${category.name.toLowerCase()}/${subcategory.toLowerCase()}`}
                          className="w-full"
                        >
                          {subcategory}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
              <Link href="/brands" className="text-white/80 hover:text-white">
                Brands
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                <Search size={20} />
              </Button>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-white relative">
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-neon-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {status === "authenticated" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white/80 hover:text-white relative">
                      {session?.user?.image ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-neon-purple">
                          <Image
                            src={session.user.image || "/placeholder.svg"}
                            alt={session.user.name || "User"}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <User size={20} />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-panel border-none w-48">
                    <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                      <Link href="/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                      <Link href="/profile/orders" className="w-full">
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white focus:bg-white/10">
                      <Link href="/profile/wishlist" className="w-full">
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-white/80 hover:text-white focus:text-white focus:bg-white/10"
                      onClick={() => signOut()}
                    >
                      <div className="w-full flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                    <User size={20} />
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white/80 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="glass-panel mx-4 mt-1 md:hidden">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="font-medium text-white">{category.name}</div>
                  <div className="pl-4 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        href={`/products/${category.name.toLowerCase()}/${subcategory.toLowerCase()}`}
                        className="block text-white/70 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <Link
                href="/brands"
                className="font-medium text-white hover:text-white/80"
                onClick={() => setIsMenuOpen(false)}
              >
                Brands
              </Link>

              {status === "authenticated" ? (
                <>
                  <Link
                    href="/profile"
                    className="font-medium text-white hover:text-white/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="font-medium text-white hover:text-white/80 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="font-medium text-white hover:text-white/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

