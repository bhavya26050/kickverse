import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddToCartButton from "@/components/AddToCartButton"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

// Helper function to convert MongoDB document to a plain JavaScript object
function convertToPlainObject(doc: any) {
  // Convert the MongoDB document to a plain JavaScript object
  const plainObj = JSON.parse(JSON.stringify(doc))
  return plainObj
}

export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string }
}) {
  await dbConnect()

  // Fetch the product and use lean() to get a plain JavaScript object
  const product = await Product.findOne({ product_id: params.id }).lean()

  if (!product) {
    notFound()
  }

  // Convert MongoDB document to plain JavaScript object
  const plainProduct = convertToPlainObject(product)

  // Get related products
  const relatedProducts = await Product.find({
    category: plainProduct.category,
    product_id: { $ne: plainProduct.product_id },
  })
  .limit(4)
  .lean()

  // Convert related products to plain JavaScript objects
  const plainRelatedProducts = relatedProducts.map(convertToPlainObject)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-white/70 hover:text-white">
            <Link href={`/products?category=${plainProduct.category}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {plainProduct.category}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl overflow-hidden aspect-square relative">
              {/* Main image */}
              <Image
                src={plainProduct.images && plainProduct.images[0] ? plainProduct.images[0] : "/placeholder.svg"}
                alt={plainProduct.product_name || "Product image"}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail images */}
            <div className="grid grid-cols-4 gap-4">
              {(plainProduct.images || []).slice(0, 4).map((image: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${plainProduct.product_name || "Product"} - view ${index + 1}`}
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
              <h1 className="text-3xl md:text-4xl font-bold">{plainProduct.product_name}</h1>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(plainProduct.rating || 0) ? "fill-purple-500 text-purple-500" : "text-gray-400"
                      }
                    />
                  ))}
                </div>
                <span className="text-white/70">
                  {plainProduct.rating || 0} ({plainProduct.reviews || 0} reviews)
                </span>
              </div>

              {/* Use sale_price instead of price which doesn't exist */}
              <p className="text-3xl font-bold">${(plainProduct.sale_price || 0).toFixed(2)}</p>
              
              {/* Show original price if there's a discount */}
              {plainProduct.discount > 0 && (
                <p className="text-white/70 line-through text-sm">
                  ${(plainProduct.listing_price || 0).toFixed(2)}
                </p>
              )}

              <p className="text-white/70 mt-4">{plainProduct.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {(plainProduct.sizes || []).map((size: string) => (
                      <button
                        key={size}
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors bg-white/10 text-white hover:bg-white/20"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {(plainProduct.colors || []).map((color: {name: string, value: string}, index: number) => (
                      <button
                        key={index}
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <AddToCartButton product={plainProduct} />
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {plainRelatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {plainRelatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.product_id} 
                  href={`/products/${relatedProduct.category}/${relatedProduct.product_id}`}
                  className="group"
                >
                  <div className="bg-white/10 rounded-lg overflow-hidden aspect-square relative mb-2">
                    <Image
                      src={relatedProduct.images && relatedProduct.images[0] ? relatedProduct.images[0] : "/placeholder.svg"}
                      alt={relatedProduct.product_name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium">{relatedProduct.product_name}</h3>
                  <p className="text-white/70">${(relatedProduct.sale_price || 0).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

