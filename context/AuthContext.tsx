"use client"

import React, { createContext, useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  status: "loading" | "authenticated" | "unauthenticated"
  session: { user: User } | null
  signIn: (provider?: string, credentials?: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
  signUp: (data: { name: string; email: string; password: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  status: "loading",
  session: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
  const [session, setSession] = useState<{ user: User } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setSession({ user: data.user })
          setStatus("authenticated")
        } else {
          setSession(null)
          setStatus("unauthenticated")
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setSession(null)
        setStatus("unauthenticated")
      }
    }

    checkAuth()
  }, [])

  const signIn = async (provider?: string, credentials?: { email: string; password: string }) => {
    try {
      if (provider === "google") {
        // For Google authentication, redirect to Google OAuth
        window.location.href = "/api/auth/google"
        return
      }

      if (credentials) {
        // Email/password authentication
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Login failed")
        }

        // Set session data from response
        setSession({ user: data.user })
        setStatus("authenticated")
        
        toast.success("Login successful!")
        router.push("/")
      }
    } catch (error) {
      console.error("Sign-in error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to sign in")
      throw error
    }
  }

  const signUp = async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed")
      }

      // Set session data from response
      setSession({ user: responseData.user })
      setStatus("authenticated")
      
      toast.success("Account created successfully!")
      router.push("/")
    } catch (error) {
      console.error("Sign-up error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create account")
      throw error
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setSession(null)
      setStatus("unauthenticated")
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Error signing out")
    }
  }

  return (
    <AuthContext.Provider value={{ status, session, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

