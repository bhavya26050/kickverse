"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"

export default function NewProductPage() {
  const router = useRouter()
  const { status } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [productData, setProductData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    images: [""],
    category: "men",
    subcategory: "running",
    sizes: ["7", "8", "9", "10", "11"],
    colors: [{ name: "Black", value: "#000000" }],
    stock: 10,
    isNew: true,
    rating: 0,
    reviews: 0,
  })

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProductData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "rating" || name === "reviews"
          ? Number.parseFloat(value)
          : name === "isNew"
            ? value === "true"
            : value,
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...productData.images]
    newImages[index] = value
    setProductData((prev) => ({ ...prev, images: newImages }))
  }

  const addImage = () => {
    setProductData((prev) => ({ ...prev, images: [...prev.images, ""] }))
  }

  const removeImage = (index: number) => {
    if (productData.images.length <= 1) return
    const newImages = [...productData.images]
    newImages.splice(index, 1)
    setProductData((prev) => ({ ...prev, images: newImages }))
  }

  const handleColorChange = (index: number, field: "name" | "value", value: string) => {
    const newColors = [...productData.colors]
    newColors[index] = { ...newColors[index], [field]: value }
    setProductData((prev) => ({ ...prev, colors: newColors }))
  }

  const addColor = () => {
    setProductData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "New Color", value: "#cccccc" }],
    }))
  }

  const removeColor = (index: number) => {
    if (productData.colors.length <= 1) return
    const newColors = [...productData.colors]
    newColors.splice(index, 1)
    setProductData((prev) => ({ ...prev, colors: newColors }))
  }

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...productData.sizes]
    newSizes[index] = value
    setProductData((prev) => ({ ...prev, sizes: newSizes }))
  }

  const addSize = () => {
    setProductData((prev) => ({ ...prev, sizes: [...prev.sizes, ""] }))
  }

  const removeSize = (index: number) => {
    if (productData.sizes.length <= 1) return
    const newSizes = [...productData.sizes]
    newSizes.splice(index, 1)
    setProductData((prev) => ({ ...prev, sizes: newSizes }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // Generate a unique ID if not provided
      if (!productData.id) {
        const id =
          productData.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") +
          "-" +
          Date.now().toString().slice(-4)

        setProductData((prev) => ({ ...prev, id }))
      }

      const response = await fetch("/api/products/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create product")
      }

      alert("Product created successfully!")
      router.push("/admin")
    } catch (error) {
      console.error("Error creating product:", error)
      alert(`Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-white/70 hover:text-white">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          <span className="text-gradient">Add New</span> Product
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id">Product ID (optional)</Label>
                <Input
                  id="id"
                  name="id"
                  value={productData.id}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                  className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                />
                <p className="text-xs text-white/50">Leave empty for auto-generation</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productData.price}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={productData.stock}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-purple"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={productData.subcategory}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-purple"
                >
                  <option value="running">Running</option>
                  <option value="basketball">Basketball</option>
                  <option value="casual">Casual</option>
                  <option value="skateboarding">Skateboarding</option>
                  <option value="training">Training</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="tennis">Tennis</option>
                  <option value="walking">Walking</option>
                  <option value="hiking">Hiking</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isNew">New Arrival</Label>
                <select
                  id="isNew"
                  name="isNew"
                  value={productData.isNew ? "true" : "false"}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-purple"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Rating (0-5)</Label>
                  <span className="text-xs text-white/50">Optional</span>
                </div>
                <Input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={productData.rating}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Product Images</Label>
                <Button
                  type="button"
                  onClick={addImage}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Plus size={16} className="mr-1" /> Add Image
                </Button>
              </div>

              {productData.images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="Image URL"
                    required
                    className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                  />
                  <Button
                    type="button"
                    onClick={() => removeImage(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300"
                    disabled={productData.images.length <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Available Sizes</Label>
                <Button
                  type="button"
                  onClick={addSize}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Plus size={16} className="mr-1" /> Add Size
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      placeholder="Size"
                      required
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                    <Button
                      type="button"
                      onClick={() => removeSize(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300"
                      disabled={productData.sizes.length <= 1}
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Available Colors</Label>
                <Button
                  type="button"
                  onClick={addColor}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Plus size={16} className="mr-1" /> Add Color
                </Button>
              </div>

              {productData.colors.map((color, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Input
                      value={color.name}
                      onChange={(e) => handleColorChange(index, "name", e.target.value)}
                      placeholder="Color Name"
                      required
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                  </div>
                  <div className="flex-1 flex gap-2 items-center">
                    <Input
                      type="color"
                      value={color.value}
                      onChange={(e) => handleColorChange(index, "value", e.target.value)}
                      className="w-12 h-10 p-1 bg-white/10 border-white/20"
                    />
                    <Input
                      value={color.value}
                      onChange={(e) => handleColorChange(index, "value", e.target.value)}
                      placeholder="Color Value"
                      required
                      className="bg-white/10 border-white/20 focus-visible:ring-neon-purple"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeColor(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300"
                    disabled={productData.colors.length <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white py-6 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating Product...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

