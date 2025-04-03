export interface Product {
  _id?: string;
  product_id: string;
  product_name: string;
  description: string;
  listing_price: number;
  sale_price: number;
  discount: number;
  brand: string;
  images: string[];
  category: string;
  quantity: number;
  rating: number;
  reviews: number;
  sizes?: string[];
  colors?: Array<{name: string, value: string}>;
  stock?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color?: string;
  category?: string;
}

export interface OrderItem extends CartItem {
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  shipping: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    method: string;
    transactionId: string;
    status: "pending" | "completed" | "failed";
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: Date;
  updated_at: Date;
}

