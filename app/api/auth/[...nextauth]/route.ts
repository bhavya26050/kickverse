import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb-client"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      // Connect to the database
      await dbConnect()

      // Find the user in our own User model
      const dbUser = await User.findOne({ email: user.email })

      if (dbUser && session.user) {
        // Add user ID to the session
        session.user.id = dbUser._id.toString()
      }

      return session
    },
    async signIn({ user, account }) {
      // Connect to the database
      await dbConnect()

      // Check if user exists in our database
      const existingUser = await User.findOne({ email: user.email })

      if (!existingUser) {
        // Create a new user if they don't exist
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider,
          cart: [],
        })
      }

      return true
    },
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }

