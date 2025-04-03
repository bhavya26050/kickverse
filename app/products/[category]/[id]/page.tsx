import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, ArrowLeft, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddToCartButton from "@/components/AddToCartButton"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string }
}) {
  await dbConnect()

  const product = await Product.findOne({ product_id: params.id })

  if (!product) {
    notFound()
  }

  // Get related products
  const relatedProducts = await Product.find({
    category: product.category,
    product_id: { $ne: product.product_id },
  }).limit(4)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-white/70 hover:text-white">
            <Link href={`/products?category=${product.category}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {product.category}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl overflow-hidden aspect-square relative">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.product_name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.product_name} - view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{product.product_name}</h1>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating || 0) ? "fill-neon-purple text-neon-purple" : "text-gray-400"
                      }
                    />
                  ))}
                </div>
                <span className="text-white/70">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

              <p className="text-white/70">{product.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${"bg-white/10 text-white hover:bg-white/20"}`}
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
                        className={`w-12 h-12 rounded-lg transition-transform ${""}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <button className="w-10 h-10 rounded-l-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Minus size={16} />
                    </button>
                    <div className="w-16 h-10 bg-white/5 flex items-center justify-center">{1}</div>
                    <button
                      className="w-10 h-10 rounded-r-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      disabled={1 >= product.stock}
                    >
                      <Plus size={16} />
                    </button>

                    <span className="ml-4 text-white/70">{product.stock} available</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <AddToCartButton product={product} />

                {product.stock === 0 && <p className="text-red-400 text-sm mt-2">This product is out of stock</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

