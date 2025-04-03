import mongoose, { Schema, type Document } from "mongoose"

export interface IProduct extends Document {
  product_id: string
  product_name: string
  listing_price: number
  sale_price: number
  discount: number
  brand: string
  description: string
  rating: number
  reviews: number
  images: string[]
  category: string
  quantity: number
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema(
  {
    product_id: { type: String, required: true, unique: true },
    product_name: { type: String, required: true },
    description: { type: String, required: true },
    listing_price: { type: Number, required: true },
    sale_price: { type: Number, required: true },
    discount: { type: Number, required: true },
    brand: { type: String, required: true },
    images: { type: [String], required: true },
    category: { type: String, required: true, lowercase: true },
    quantity: { type: Number, required: true },
    rating: { type: Number, required: true, default: 5 },
    reviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

