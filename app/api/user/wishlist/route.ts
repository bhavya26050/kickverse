import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import { verifyJwtToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get user token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Verify token and get user ID
    let userId;
    try {
      const decoded = verifyJwtToken(token);
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Get wishlist items
    const wishlistItems = user.wishlist || [];
    
    // Get full product details for wishlist items
    const products = await Product.find({
      product_id: { $in: wishlistItems }
    }).lean();
    
    return NextResponse.json({ wishlist: products });
  } catch (error) {
    console.error("Error getting wishlist:", error);
    return NextResponse.json(
      { message: "Failed to get wishlist", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get user token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Verify token and get user ID
    let userId;
    try {
      const decoded = verifyJwtToken(token);
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }
    
    // Verify product exists
    const product = await Product.findOne({ product_id: productId });
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    // Find user and update wishlist
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    // Check if product is already in wishlist
    const isInWishlist = user.wishlist.includes(productId);
    
    if (isInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id !== productId);
      await user.save();
      
      return NextResponse.json({
        message: "Product removed from wishlist",
        inWishlist: false
      });
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      await user.save();
      
      return NextResponse.json({
        message: "Product added to wishlist",
        inWishlist: true
      });
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json(
      { message: "Failed to update wishlist", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

