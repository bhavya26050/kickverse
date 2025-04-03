import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"
import User from "@/models/User"
import bcrypt from "bcryptjs"

const initialProducts = [
  {
    product_id: "air-zoom-1",
    product_name: "Air Zoom Pulse",
    description:
      "The Air Zoom Pulse is designed for the modern athlete, featuring responsive cushioning and a sleek design. Perfect for both casual wear and athletic performance.",
    listing_price: 149.99,
    sale_price: 129.99,
    discount: 13,
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    ],
    category: "men",
    quantity: 15,
    rating: 4.5,
    reviews: 12,
  },
  {
    product_id: "cloud-runner-2",
    product_name: "Cloud Runner X",
    description:
      "The Cloud Runner X combines style and comfort with its innovative cushioning system and breathable upper. Designed for runners who demand both performance and aesthetics.",
    listing_price: 179.99,
    sale_price: 149.99,
    discount: 17,
    brand: "Adidas",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    ],
    category: "women",
    quantity: 8,
    rating: 4.8,
    reviews: 24,
  },
  {
    product_id: "street-force-3",
    product_name: "Street Force Pro",
    description:
      "The Street Force Pro is built for urban explorers. With its durable construction and street-ready style, it's the perfect companion for city adventures.",
    listing_price: 139.99,
    sale_price: 119.99,
    discount: 14,
    brand: "Puma",
    images: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    ],
    category: "men",
    quantity: 20,
    rating: 4.2,
    reviews: 8,
  },
  {
    product_id: "flex-motion-4",
    product_name: "Flex Motion Elite",
    description:
      "The Flex Motion Elite offers unparalleled flexibility and support. Its adaptive fit technology ensures comfort throughout your workout or daily activities.",
    listing_price: 189.99,
    sale_price: 159.99,
    discount: 16,
    brand: "New Balance",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    ],
    category: "women",
    quantity: 12,
    rating: 4.7,
    reviews: 18,
  },
  {
    product_id: "runner-boost-5",
    product_name: "Runner Boost Pro",
    description:
      "The Runner Boost Pro delivers exceptional energy return with its responsive cushioning. Perfect for serious runners looking for performance and durability.",
    listing_price: 199.99,
    sale_price: 169.99,
    discount: 15,
    brand: "Adidas",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    ],
    category: "men",
    quantity: 10,
    rating: 4.6,
    reviews: 15,
  },
  {
    product_id: "urban-glide-6",
    product_name: "Urban Glide X",
    description:
      "The Urban Glide X is designed for the city dweller who needs style and function. Its sleek profile and comfortable fit make it perfect for all-day wear.",
    listing_price: 159.99,
    sale_price: 139.99,
    discount: 12,
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    ],
    category: "women",
    quantity: 18,
    rating: 4.4,
    reviews: 10,
  },
]

// Initial admin user for testing
const initialAdmin = {
  name: "Admin User",
  email: "admin@kickverse.com",
  password: "admin123", // Will be hashed before storage
  role: "admin",
}

export async function GET() {
  try {
    await dbConnect()

    // Clear existing products
    await Product.deleteMany({})

    // Insert new products
    await Product.insertMany(initialProducts)

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: initialAdmin.email })
    
    if (!existingAdmin) {
      // Hash admin password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(initialAdmin.password, salt)
      
      // Create admin user
      await User.create({
        ...initialAdmin,
        password: hashedPassword,
        provider: "credentials",
        created_at: new Date(),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      productsCount: initialProducts.length,
      adminCreated: !existingAdmin
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

