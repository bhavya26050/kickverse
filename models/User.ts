import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  provider?: string
  providerId?: string
  image?: string
  role: string
  cart: Array<{
    product_id: string
    quantity: number
    size: string
  }>
  wishlist: string[]
  orders: string[]
  created_at: Date
  updated_at: Date
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: 'credentials' },
  providerId: { type: String },
  image: { type: String },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  cart: [
    {
      product_id: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      size: { type: String, required: true }
    }
  ],
  wishlist: [
    { type: String }
  ],
  orders: [
    { type: Schema.Types.ObjectId, ref: 'Order' }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

