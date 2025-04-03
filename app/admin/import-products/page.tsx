"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [inventorySummary, setInventorySummary] = useState<any>(null)
  const router = useRouter()

  // Fetch inventory summary on component mount
  useEffect(() => {
    const fetchInventorySummary = async () => {
      try {
        const response = await fetch('/api/products/inventory/summary')
        if (response.ok) {
          const data = await response.json()
          setInventorySummary(data)
        }
      } catch (err) {
        console.error("Failed to fetch inventory summary:", err)
      }
    }
    
    fetchInventorySummary()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError("Please select a CSV file")
      return
    }
    
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }
    
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      // Add flag to ensure inventory is initialized for each product
      formData.append("initializeInventory", "true")
      
      const response = await fetch("/api/products/csv-import", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to import products")
      }
      
      setResult(data)
      
      // Refresh inventory summary
      const inventoryResponse = await fetch('/api/products/inventory/summary')
      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json()
        setInventorySummary(inventoryData)
      }
      
      // Refresh the cache
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Import Products from CSV</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file" className="block mb-2 font-medium">
              Select CSV File
            </label>
            <input
              type="file"
              id="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
            <p className="mt-2 text-sm text-gray-500">
              CSV should include columns: id (optional), name, description, price, images, category, subcategory, 
              sizes, colors, featured, inventory (optional)
            </p>
            <p className="mt-1 text-sm text-gray-500">
              If inventory is not specified, default quantities will be generated for each size and color combination.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Importing..." : "Import Products"}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Successfully imported {result.count} products.</p>
            <p className="mt-1">Inventory has been initialized for all products.</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => router.push("/admin/products")}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                View Products
              </button>
              <button
                onClick={() => router.push("/admin/inventory")}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Manage Inventory
              </button>
            </div>
          </div>
        )}
      </div>
      
      {inventorySummary && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Inventory Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <p className="text-lg font-medium">Total Products</p>
              <p className="text-3xl font-bold">{inventorySummary.totalProducts}</p>
            </div>
            <div className="border rounded-lg p-4 bg-green-50">
              <p className="text-lg font-medium">In Stock Items</p>
              <p className="text-3xl font-bold">{inventorySummary.inStockItems}</p>
            </div>
            <div className="border rounded-lg p-4 bg-yellow-50">
              <p className="text-lg font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold">{inventorySummary.lowStockItems}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">CSV Format Example</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {`name,description,price,images,category,subcategory,sizes,colors,featured,inventory
Air Zoom Tempo,Premium running shoes for maximum comfort,129.99,https://example.com/image1.jpg,men,running,7,8,9,10,Black:#000000;White:#ffffff,false,10:Black:7=15;10:White:7=12
Air Max 270,Casual everyday wear with air cushioning,149.99,https://example.com/image2.jpg,women,casual,6,7,8,9,Black:#000000;Pink:#ff69b4,true`}
        </pre>
        <p className="mt-2 text-sm text-gray-500">
          The inventory column is optional and follows the format: quantity:color:size=value. Multiple inventory entries are separated by semicolons.
          If not provided, default quantities will be generated.
        </p>
      </div>
    </div>
  )
}
