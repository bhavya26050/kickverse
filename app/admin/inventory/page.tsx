"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface InventoryItem {
  productId: string
  name: string
  image: string
  category: string
  size: string
  color: string
  quantity: number
}

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedInStockStatus, setSelectedInStockStatus] = useState("all")

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products/inventory/all')
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data')
      }
      
      const data = await response.json()
      setInventory(data.inventory)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInventory = async (productId: string, size: string, color: string, newQuantity: number) => {
    try {
      const response = await fetch('/api/products/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          size,
          color,
          quantity: newQuantity,
          action: 'set'
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update inventory')
      }
      
      // Refresh inventory data after update
      fetchInventory()
    } catch (err) {
      alert('Error updating inventory: ' + (err instanceof Error ? err.message : 'An error occurred'))
    }
  }

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    // Filter by search query
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.size.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    // Filter by in-stock status
    const matchesStockStatus = 
      selectedInStockStatus === 'all' ||
      (selectedInStockStatus === 'in-stock' && item.quantity > 0) ||
      (selectedInStockStatus === 'out-of-stock' && item.quantity === 0) ||
      (selectedInStockStatus === 'low-stock' && item.quantity > 0 && item.quantity < 5)
    
    return matchesSearch && matchesCategory && matchesStockStatus
  })

  // Get unique categories for filter
  const categories = ['all', ...new Set(inventory.map(item => item.category))]

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={fetchInventory}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Product
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="block mb-1 font-medium">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search by product name, ID, color, or size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div className="w-full md:w-64">
            <label htmlFor="category" className="block mb-1 font-medium">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-64">
            <label htmlFor="stock-status" className="block mb-1 font-medium">Stock Status</label>
            <select
              id="stock-status"
              value={selectedInStockStatus}
              onChange={(e) => setSelectedInStockStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="low-stock">Low Stock</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedInStockStatus('all')
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {filteredInventory.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center py-10">
          <p className="text-lg text-gray-500">No inventory items found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item, index) => (
                  <tr key={`${item.productId}-${item.size}-${item.color}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">ID: {item.productId}</div>
                          <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span 
                          className="w-4 h-4 rounded-full mr-2 border border-gray-300" 
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="text-sm text-gray-900">{item.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        item.quantity === 0 
                          ? 'text-red-600' 
                          : item.quantity < 5 
                            ? 'text-yellow-600' 
                            : 'text-green-600'
                      }`}>
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateInventory(
                            item.productId, 
                            item.size, 
                            item.color, 
                            Math.max(0, item.quantity - 1)
                          )}
                          className="text-red-600 hover:text-red-900"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleUpdateInventory(
                            item.productId, 
                            item.size, 
                            item.color, 
                            Math.max(0, parseInt(e.target.value) || 0)
                          )}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                        />
                        <button
                          onClick={() => handleUpdateInventory(
                            item.productId, 
                            item.size, 
                            item.color, 
                            item.quantity + 1
                          )}
                          className="text-green-600 hover:text-green-900"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
