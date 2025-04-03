import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export default async function HomePage() {
  await dbConnect()

  // Fetch featured products (high rating)
  const featuredProducts = await Product.find({ rating: { $gte: 4 } })
    .sort({ rating: -1 })
    .limit(4)

  // Fetch new arrivals (most recent)
  const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(4)

  // Fetch popular brands
  const brands = await Product.aggregate([
    { $group: { _id: "$brand", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Step Into <span className="text-gradient">Innovation</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-md">
                Discover premium sneakers designed for style, comfort, and performance. Elevate your footwear game
                today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white px-8 py-6 text-lg"
                >
                  <Link href="/products/men">Shop Men</Link>
                </Button>
                <Button asChild className="bg-white/10 hover:bg-white/20 text-white px-8 py-6 text-lg">
                  <Link href="/products/women">Shop Women</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="glass-panel rounded-2xl p-6 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop"
                    alt="Premium Sneakers"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute bottom-12 left-12 right-12 glass-panel p-4 rounded-lg">
                    <p className="font-bold text-xl mb-1">Premium Collection</p>
                    <p className="text-white/70">Limited edition designs</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Shop by <span className="text-gradient">Category</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/products/men" className="group">
              <div className="glass-panel rounded-2xl p-4 overflow-hidden transition-transform group-hover:scale-[1.02]">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1780&auto=format&fit=crop"
                    alt="Men's Sneakers"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold mb-1">Men</h3>
                    <p className="text-white/70 mb-2">Performance & style</p>
                    <div className="flex items-center text-blue-400">
                      <span>Shop Now</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/products/women" className="group">
              <div className="glass-panel rounded-2xl p-4 overflow-hidden transition-transform group-hover:scale-[1.02]">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop"
                    alt="Women's Sneakers"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold mb-1">Women</h3>
                    <p className="text-white/70 mb-2">Comfort meets fashion</p>
                    <div className="flex items-center text-blue-400">
                      <span>Shop Now</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/products/kids" className="group">
              <div className="glass-panel rounded-2xl p-4 overflow-hidden transition-transform group-hover:scale-[1.02]">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1551861568-c0ffe0b5d523?q=80&w=2070&auto=format&fit=crop"
                    alt="Kids' Sneakers"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold mb-1">Kids</h3>
                    <p className="text-white/70 mb-2">Durable & playful</p>
                    <div className="flex items-center text-blue-400">
                      <span>Shop Now</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Featured <span className="text-gradient">Products</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white px-8 py-6 text-lg"
            >
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Popular <span className="text-gradient">Brands</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <Link key={brand._id} href={`/brands/${brand._id.toLowerCase()}`}>
                <div className="glass-panel rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
                  <h3 className="font-bold text-lg">{brand._id}</h3>
                  <p className="text-white/70 text-sm">{brand.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            New <span className="text-gradient">Arrivals</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              <Link href="/products/new-arrivals">View All New Arrivals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our <span className="text-gradient">Newsletter</span>
              </h2>
              <p className="text-white/70 mb-8">
                Subscribe to get special offers, free giveaways, and exclusive deals on the latest releases.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white px-6 py-3">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

