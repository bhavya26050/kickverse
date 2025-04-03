"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ProductCard from "./ProductCard"

// Sample product data
const products = [
  {
    id: "air-zoom-1",
    name: "Air Zoom Pulse",
    price: 129.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "men",
    isNew: true,
  },
  {
    id: "cloud-runner-2",
    name: "Cloud Runner X",
    price: 149.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "women",
  },
  {
    id: "street-force-3",
    name: "Street Force Pro",
    price: 119.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "men",
    isNew: true,
  },
  {
    id: "flex-motion-4",
    name: "Flex Motion Elite",
    price: 159.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "women",
  },
]

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredProducts =
    activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured <span className="text-gradient">Collection</span>
          </motion.h2>
          <motion.p
            className="text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover our most popular designs and latest releases
          </motion.p>
        </div>

        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {["all", "men", "women", "kids"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === category
                  ? "bg-gradient-to-r from-neon-purple to-neon-blue text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

