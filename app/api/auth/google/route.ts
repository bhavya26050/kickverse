import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// This is a simplified Google auth example
// In production, you'd need to use the Google OAuth API properly

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";
  
  if (!googleClientId) {
    return NextResponse.json(
      { message: "Google client ID is not configured" },
      { status: 500 }
    );
  }
  
  // Create the Google OAuth URL with exact redirect URI as configured in Google Cloud Console
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.append("client_id", googleClientId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", "openid email profile");
  authUrl.searchParams.append("prompt", "select_account");
  
  console.log("Redirecting to Google OAuth with redirect URI:", redirectUri);
  
  return NextResponse.redirect(authUrl.toString());
}

// Normally, you'd implement a callback endpoint as well
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user: googleUser } = body;

    if (!googleUser?.email) {
      return NextResponse.json(
        { message: "Invalid Google auth data" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        provider: "google",
        google_id: googleUser.sub,
        role: "user",
      });
    } else if (user.provider !== "google") {
      // Update existing user to include Google data
      user.provider = "google";
      user.google_id = googleUser.sub;
      user.image = googleUser.picture || user.image;
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Create response
    const response = NextResponse.json({
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });

    // Set cookie
    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { message: "Google authentication failed" },
      { status: 500 }
    );
  }
}