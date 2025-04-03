"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

interface AddToCartButtonProps {
  product: {
    product_id: string
    product_name: string
    sale_price: number
    images: string[]
    sizes: string[]
    colors: { name: string; value: string }[]
    stock: number
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value)

  const handleAddToCart = () => {
    addItem({
      productId: product.product_id,
      name: product.product_name,
      price: product.sale_price,
      image: product.images[0],
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    })
    alert("Product added to cart!")
  }

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white py-6 text-lg"
      disabled={product.stock === 0}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  )
}

