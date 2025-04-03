"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircleDot, Palette, Type, ImageIcon, ShoppingCart } from "lucide-react"
import SneakerModel from "@/components/SneakerModel"

const colorOptions = [
  { name: "Purple", value: "#b026ff" },
  { name: "Blue", value: "#2176ff" },
  { name: "Teal", value: "#01ffc3" },
  { name: "Pink", value: "#ff2ded" },
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
]

const materialOptions = ["Leather", "Canvas", "Suede", "Mesh", "Knit"]

export default function CustomizePage() {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0])

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gradient">Customize</span> Your Sneakers
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3D Model Preview */}
          <motion.div
            className="glass-panel rounded-2xl p-8 h-[600px] relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SneakerModel autoRotate={false} />
          </motion.div>

          {/* Customization Options */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="colors" className="glass-panel rounded-2xl p-8">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="colors" className="data-[state=active]:bg-white/10">
                  <Palette className="mr-2 h-4 w-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="materials" className="data-[state=active]:bg-white/10">
                  <CircleDot className="mr-2 h-4 w-4" />
                  Materials
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-white/10">
                  <Type className="mr-2 h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="graphics" className="data-[state=active]:bg-white/10">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Graphics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-6">
                <h3 className="text-xl font-medium mb-4">Choose Colors</h3>
                <div className="grid grid-cols-3 gap-4">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`p-4 rounded-lg flex flex-col items-center transition-all ${
                        selectedColor.name === color.name ? "ring-2 ring-white" : "hover:bg-white/5"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full mb-2" style={{ backgroundColor: color.value }}></div>
                      <span className="text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="materials" className="space-y-6">
                <h3 className="text-xl font-medium mb-4">Choose Material</h3>
                <div className="grid grid-cols-2 gap-4">
                  {materialOptions.map((material) => (
                    <button
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={`p-4 rounded-lg flex items-center transition-all ${
                        selectedMaterial === material ? "bg-white/10 ring-2 ring-white" : "hover:bg-white/5"
                      }`}
                    >
                      <span>{material}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-6">
                <h3 className="text-xl font-medium mb-4">Add Custom Text</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-purple"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/70 block mb-2">Font</label>
                      <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-purple">
                        <option>Sans Serif</option>
                        <option>Serif</option>
                        <option>Monospace</option>
                        <option>Script</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-white/70 block mb-2">Size</label>
                      <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-purple">
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                      </select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="graphics" className="space-y-6">
                <h3 className="text-xl font-medium mb-4">Add Graphics</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <button
                      key={item}
                      className="aspect-square bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <ImageIcon size={20} />
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex flex-col space-y-4">
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Your Custom Sneaker</h3>
                  <span className="text-2xl font-bold">$199.99</span>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/70">Base Model</span>
                    <span>KickVerse Pro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Color</span>
                    <span>{selectedColor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Material</span>
                    <span>{selectedMaterial}</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white py-6 text-lg">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              </div>

              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 py-6 text-lg">
                Save Design
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

