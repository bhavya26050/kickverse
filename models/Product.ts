import mongoose from "mongoose"

const colorSchema = new mongoose.Schema({
  name: String,
  value: String
})

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    description: String,
    listing_price: Number,
    sale_price: Number,
    discount: {
      type: Number,
      default: 0,
    },
    brand: String,
    images: [String],
    category: {
      type: String,
      enum: ["men", "women", "kids"],
      required: true,
    },
    quantity: {
      type: Number,
      default: 10,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    sizes: {
      type: [String],
      default: ["7", "8", "9", "10", "11", "12"],
    },
    colors: {
      type: [colorSchema],
      default: [
        { name: "Black", value: "#000000" },
        { name: "White", value: "#FFFFFF" },
      ],
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Add method to convert to Plain JavaScript Object
productSchema.methods.toJSON = function() {
  const product = this.toObject()
  // Convert MongoDB ObjectIDs to strings
  if (product._id) product._id = product._id.toString()
  // Convert nested ObjectIDs
  if (product.colors && Array.isArray(product.colors)) {
    product.colors = product.colors.map(color => {
      if (color._id) {
        return {
          ...color,
          _id: color._id.toString()
        }
      }
      return color
    })
  }
  return product
}

// Define and export the model
const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product

