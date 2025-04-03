"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"

export default function LoginPage() {
  const { status, signIn, signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")
  const [signupName, setSignupName] = useState("")

  // Check for error params
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  // If already authenticated, redirect to home
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile")
    }
  }, [status, router])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError("")
      // The actual redirect happens in the signIn function
      await signIn("google")
    } catch (error) {
      console.error("Google sign in error:", error)
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      await signIn(null, { email: loginEmail, password: loginPassword })
      // Success will redirect in the signIn function
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignup = async (e) => {
    e.preventDefault()
    setError("")

    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (signupPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    try {
      setIsLoading(true)
      await signUp({
        name: signupName,
        email: signupEmail,
        password: signupPassword
      })
      // Success will redirect in the signUp function
    } catch (error) {
      console.error("Signup error:", error)
      setError(error instanceof Error ? error.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-panel p-8 rounded-2xl">
            <h1 className="text-3xl font-bold text-center mb-8">
              <span className="text-gradient">Welcome</span> Back
            </h1>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            )}

            <Tabs defaultValue="login" className="mb-8">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="login" className="data-[state=active]:bg-white/10">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white/10">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white py-6"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : null}
                    Sign in
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-white/70">Or continue with</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-white/90 flex items-center justify-center py-6"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                  ) : (
                    <FcGoogle className="mr-2 h-5 w-5" />
                  )}
                  Sign in with Google
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white py-6"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : null}
                    Create Account
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-white/70">Or sign up with</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-white/90 flex items-center justify-center py-6"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                  ) : (
                    <FcGoogle className="mr-2 h-5 w-5" />
                  )}
                  Sign up with Google
                </Button>

                <p className="text-sm text-white/50 text-center mt-4">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

