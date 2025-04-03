"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/ProductCard"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"
import { Filter } from "lucide-react"

interface SearchParams {
  category?: string
  brand?: string
  page?: string
  sort?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await dbConnect()

  const page = Number.parseInt(searchParams.page || "1")
  const limit = 12
  const skip = (page - 1) * limit

  // Build query based on filters
  const query: any = {}

  if (searchParams.category) {
    query.category = searchParams.category
  }

  if (searchParams.brand) {
    query.brand = searchParams.brand
  }

  // Get total count for pagination
  const totalCount = await Product.countDocuments(query)

  // Determine sort order
  let sortOptions = {}
  switch (searchParams.sort) {
    case "price-asc":
      sortOptions = { sale_price: 1 }
      break
    case "price-desc":
      sortOptions = { sale_price: -1 }
      break
    case "newest":
      sortOptions = { createdAt: -1 }
      break
    case "rating":
      sortOptions = { rating: -1 }
      break
    default:
      sortOptions = { createdAt: -1 }
  }

  // Get products with pagination
  const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit)

  // Get all brands for filter
  const brands = await Product.distinct("brand")

  // Get all categories for filter
  const categories = await Product.distinct("category")

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          All <span className="text-gradient">Products</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="glass-panel rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Filter size={20} />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block px-3 py-2 rounded-lg ${
                      !searchParams.category ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    All Categories
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/products?category=${category}`}
                      className={`block px-3 py-2 rounded-lg ${
                        searchParams.category === category ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                      }`}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Brands</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/products?${
                        searchParams.category ? `category=${searchParams.category}&` : ""
                      }brand=${brand}`}
                      className={`block px-3 py-2 rounded-lg ${
                        searchParams.brand === brand ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                      }`}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Link href="/products">Clear Filters</Link>
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-white/70">
                Showing {products.length} of {totalCount} products
              </p>

              <div className="flex items-center gap-2">
                <span className="text-white/70">Sort by:</span>
                <select
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none"
                  defaultValue={searchParams.sort || "newest"}
                  onChange={(e) => {
                    const url = new URL(window.location.href)
                    url.searchParams.set("sort", e.target.value)
                    window.location.href = url.toString()
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <Suspense fallback={<div>Loading products...</div>}>
              {products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl mb-4">No products found</p>
                  <p className="text-white/70 mb-6">Try adjusting your filters or search criteria</p>
                  <Button asChild>
                    <Link href="/products">View All Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                  ))}
                </div>
              )}
            </Suspense>

            {/* Pagination */}
            {totalCount > limit && (
              <div className="mt-12 flex justify-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  disabled={page === 1}
                >
                  <Link
                    href={`/products?${searchParams.category ? `category=${searchParams.category}&` : ""}${
                      searchParams.brand ? `brand=${searchParams.brand}&` : ""
                    }${searchParams.sort ? `sort=${searchParams.sort}&` : ""}page=${page - 1}`}
                    scroll={false}
                  >
                    Previous
                  </Link>
                </Button>

                <div className="flex items-center px-4 py-2 bg-white/10 rounded-lg">
                  Page {page} of {Math.ceil(totalCount / limit)}
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  disabled={page >= Math.ceil(totalCount / limit)}
                >
                  <Link
                    href={`/products?${searchParams.category ? `category=${searchParams.category}&` : ""}${
                      searchParams.brand ? `brand=${searchParams.brand}&` : ""
                    }${searchParams.sort ? `sort=${searchParams.sort}&` : ""}page=${page + 1}`}
                    scroll={false}
                  >
                    Next
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

