import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // not required because of OAuth logins
  },
  provider: {
    type: String,
    default: "credentials",
  },
  providerId: String,
  image: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  cart: [{
    product_id: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    size: {
      type: String,
      required: true
    }
  }],
  wishlist: [String], // Array of product_ids
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true })

// Don't return the password in queries
UserSchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret.password
    return ret
  }
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
