"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductCard from "@/components/ProductCard"
import { Search, Filter, Loader } from "lucide-react"
import type { Product } from "@/types/product"

export default function SneakersPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const brands = [
    "Nike",
    "Adidas",
    "Jordan",
    "Puma",
    "New Balance",
    "Reebok",
    "Converse",
    "Vans",
    "Under Armour",
    "Asics",
  ]

  const fetchSneakers = async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (searchQuery) queryParams.set("query", searchQuery)
      if (selectedBrand) queryParams.set("brand", selectedBrand)
      queryParams.set("page", page.toString())
      queryParams.set("limit", "12")

      const response = await fetch(`/api/sneakers?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch sneakers")
      }

      const data = await response.json()
      setProducts(data.products)
      setTotalCount(data.count)
    } catch (err) {
      console.error("Error fetching sneakers:", err)
      setError("Failed to load sneakers. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSneakers()
    // Update URL with search params
    const params = new URLSearchParams()
    if (searchQuery) params.set("query", searchQuery)
    if (selectedBrand) params.set("brand", selectedBrand)
    if (page > 1) params.set("page", page.toString())

    const newUrl = `/sneakers${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl, { scroll: false })
  }, [searchQuery, selectedBrand, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
    fetchSneakers()
  }

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand === selectedBrand ? "" : brand)
    setPage(1) // Reset to first page on filter change
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedBrand("")
    setPage(1)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-8"
        >
          Explore <span className="text-gradient">Sneakers</span>
        </motion.h1>

        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <Input
                type="text"
                placeholder="Search sneakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 focus-visible:ring-neon-purple"
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white"
            >
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
            </Button>
          </form>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 glass-panel rounded-lg p-4"
            >
              <div className="mb-4">
                <h3 className="font-medium mb-2">Brands</h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <Button
                      key={brand}
                      variant="outline"
                      size="sm"
                      className={`border-white/20 ${
                        selectedBrand === brand
                          ? "bg-neon-purple/20 text-white border-neon-purple/50"
                          : "text-white/70 hover:bg-white/10"
                      }`}
                      onClick={() => handleBrandSelect(brand)}
                    >
                      {brand}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin h-8 w-8 text-neon-purple" />
            <span className="ml-2">Loading sneakers...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchSneakers}>Try Again</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl mb-4">No sneakers found</p>
            <p className="text-white/70 mb-6">Try adjusting your search or filters</p>
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-white/70">
                Showing {products.length} of {totalCount} results
              </p>
              <div className="flex items-center gap-2">
                <span className="text-white/70">Sort by:</span>
                <select className="bg-white/10 border border-white/20 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple">
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-2">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 py-2 bg-white/10 rounded-md">Page {page}</div>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                disabled={products.length < 12}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

