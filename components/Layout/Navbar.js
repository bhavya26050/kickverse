import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            KickVerse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              All Shoes
            </Link>
            <Link href="/category/men" className="hover:text-blue-600 transition-colors">
              Men
            </Link>
            <Link href="/category/women" className="hover:text-blue-600 transition-colors">
              Women
            </Link>
            <Link href="/category/kids" className="hover:text-blue-600 transition-colors">
              Kids
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search for shoes..."
              className="px-4 py-2 w-64 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white p-2 hover:bg-blue-700 transition-colors"
            >
              <Search size={20} />
            </button>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User size={24} />
            </Link>
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <form onSubmit={handleSearch} className="flex items-center border rounded-lg overflow-hidden mb-4">
              <input
                type="text"
                placeholder="Search for shoes..."
                className="px-4 py-2 w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white p-2 hover:bg-blue-700 transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
            
            <div className="flex flex-col space-y-3">
              <Link 
                href="/products"
                className="py-2 px-3 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                All Shoes
              </Link>
              <Link 
                href="/category/men"
                className="py-2 px-3 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Men
              </Link>
              <Link 
                href="/category/women"
                className="py-2 px-3 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Women
              </Link>
              <Link 
                href="/category/kids"
                className="py-2 px-3 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Kids
              </Link>
              <div className="border-t pt-2 mt-2">
                <Link 
                  href="/login"
                  className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
