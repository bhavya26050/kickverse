"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { toast } from "react-hot-toast"
import { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  
  const [inWishlist, setInWishlist] = useState(false)
  
  useEffect(() => {
    // Check if the product is in the wishlist when the component mounts or wishlist changes
    if (product && product.product_id) {
      setInWishlist(isInWishlist(product.product_id))
    }
  }, [product, isInWishlist])

  if (!product) {
    return null;
  }

  const {
    product_id,
    product_name,
    images,
    listing_price,
    sale_price,
    discount,
    brand,
    rating,
    reviews,
    category
  } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      productId: product_id,
      name: product_name,
      price: sale_price,
      image: images && images.length > 0 ? images[0] : "/placeholder.svg",
      quantity: 1,
      size: "9", // Default size
      category: category
    })
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Optimistic UI update
    setInWishlist(!inWishlist)
    
    try {
      await toggleWishlist(product_id)
    } catch (error) {
      // Revert on error
      setInWishlist(inWishlist)
      toast.error("Failed to update wishlist")
    }
  }

  const productUrl = `/products/${category}/${product_id}`

  // Apply motion animation
  const cardVariants = {
    hover: {
      y: -5,
      transition: { duration: 0.3 },
    },
  }

  return (
    <Link href={productUrl}>
      <motion.div
        className="group relative bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        variants={cardVariants}
        whileHover="hover"
      >
        {/* Sale tag */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist button */}
        <button
          className={`absolute top-3 right-3 z-10 p-1.5 rounded-full ${
            inWishlist ? "bg-red-500 text-white" : "bg-black/50 text-white/80 hover:bg-black/70"
          } transition-all duration-300`}
          onClick={handleToggleWishlist}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-white" : ""}`} />
        </button>

        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-black/40">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={product_name}
              width={500}
              height={500}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Image
                src="/placeholder.svg"
                alt="No image available"
                width={500}
                height={500}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white line-clamp-1">
                {product_name}
              </p>
              <p className="text-xs text-white/70 mb-2">{brand}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-white">
                  ${sale_price.toFixed(2)}
                </p>
                {discount > 0 && (
                  <p className="text-sm text-white/60 line-through">
                    ${listing_price.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xs">
                      {i < Math.floor(rating) ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-400">★</span>
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-white/70">({reviews})</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-neon-purple to-neon-blue text-white text-xs font-semibold py-2 px-3 rounded-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

