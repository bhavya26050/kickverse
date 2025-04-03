'use client'

import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/ProductGrid"
import { ProductCard } from "@/components/ProductCard"
import { Product } from "@/types/Product"

export function SearchResultsContent({ query }: { query: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true)
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Failed to fetch search results')
        
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error searching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (query) {
      fetchSearchResults()
    }
  }, [query])
  
  if (loading) return <div>Loading...</div>
  
  if (products.length === 0) {
    return <div className="text-center py-10">No products found matching "{query}"</div>
  }
  
  return (
    <ProductGrid>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </ProductGrid>
  )
}
