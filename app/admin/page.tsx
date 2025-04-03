'use client'
import { Product } from "@/types/product"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Plus, Edit, Trash, FileUp } from "lucide-react"
import dbConnect from "@/lib/mongodb"
import ProductModel from "@/models/Product"

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/products")
        
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Function to handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete product")
        }

        // Remove product from state
        setProducts(products.filter(p => p.product_id !== productId))
      } catch (err) {
        console.error("Error deleting product:", err)
        alert("Failed to delete product")
      }
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <div className="flex gap-3">
            <Button asChild className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90">
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                New Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/admin/import-products">
                <FileUp className="mr-2 h-4 w-4" />
                Import Products
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-purple"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="glass-panel p-6 rounded-xl mb-8">
              <h2 className="text-xl font-bold mb-4">Store Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="text-lg font-medium">Total Products</h3>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                {/* Add more overview cards here like Sales, Orders, etc. */}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 text-left">Product</th>
                      <th className="py-3 text-left">Price</th>
                      <th className="py-3 text-left">Category</th>
                      <th className="py-3 text-left">Stock</th>
                      <th className="py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.product_id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                                alt={product.product_name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{product.product_name}</p>
                              <p className="text-xs text-white/70">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div>
                            <p className="font-medium">${product.sale_price.toFixed(2)}</p>
                            {product.discount > 0 && (
                              <p className="text-xs text-white/70 line-through">${product.listing_price.toFixed(2)}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`font-medium ${
                            product.quantity > 10 ? "text-green-400" : product.quantity > 0 ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                              <Link href={`/admin/products/${product.product_id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              onClick={() => handleDeleteProduct(product.product_id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

