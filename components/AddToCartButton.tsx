"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { toast } from "react-hot-toast"

type ProductType = {
  product_id: string
  product_name: string
  sale_price: number
  images: string[]
  category: string
  sizes: string[]
  colors: { name: string; value: string }[]
}

export default function AddToCartButton({ product }: { product: ProductType }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "")
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  
  const { addItem } = useCart()
  const router = useRouter()
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }
    
    try {
      setIsAdding(true)
      
      addItem({
        productId: product.product_id,
        name: product.product_name,
        price: product.sale_price, // Use sale_price as the price
        image: product.images?.[0] || "/placeholder.svg",
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
        category: product.category
      })
      
      toast.success(`${product.product_name} added to cart!`)
      
      // Optional: Navigate to cart
      router.push("/cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Size</h3>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  selectedSize === size 
                    ? "bg-purple-500 text-white" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Color</h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                className={`w-12 h-12 rounded-lg transition-transform ${
                  selectedColor === color.name ? "ring-2 ring-purple-500 scale-110" : ""
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                onClick={() => setSelectedColor(color.name)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white py-6 text-lg"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}

