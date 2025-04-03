"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

// Create the authentication context
const AuthContext = createContext({})

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext)
}

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState("loading") // "loading", "authenticated", "unauthenticated"
  const router = useRouter()

  // Check if user is logged in when the component mounts
  useEffect(() => {
    checkUserSession()
  }, [])

  // Function to check the user's session
  const checkUserSession = async () => {
    try {
      setStatus("loading")
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setStatus("authenticated")
      } else {
        setUser(null)
        setStatus("unauthenticated")
      }
    } catch (error) {
      console.error("Failed to check session:", error)
      setUser(null)
      setStatus("unauthenticated")
    }
  }

  // Sign in with email and password
  const signIn = async (provider, credentials) => {
    try {
      setStatus("loading")
      
      if (provider === "google") {
        // Redirect to Google OAuth endpoint
        window.location.href = "/api/auth/google"
        return
      }
      
      // Email/password login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to sign in")
      }

      const data = await response.json()
      setUser(data.user)
      setStatus("authenticated")
      toast.success("Logged in successfully!")
      router.push("/profile")
    } catch (error) {
      console.error("Sign in error:", error)
      setStatus("unauthenticated")
      toast.error(error.message || "Failed to sign in")
      throw error
    }
  }

  // Sign up with email and password
  const signUp = async (userData) => {
    try {
      setStatus("loading")
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to sign up")
      }

      const data = await response.json()
      setUser(data.user)
      setStatus("authenticated")
      toast.success("Account created successfully!")
      router.push("/profile")
    } catch (error) {
      console.error("Sign up error:", error)
      setStatus("unauthenticated")
      toast.error(error.message || "Failed to create account")
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      setUser(null)
      setStatus("unauthenticated")
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to log out")
    }
  }

  // Context value
  const value = {
    user,
    status,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
