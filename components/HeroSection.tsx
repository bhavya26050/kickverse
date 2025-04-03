"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import SneakerModel from "./SneakerModel"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative min-h-[90vh] overflow-hidden hero-gradient">
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-gradient">Reimagine</span> Your Sneakers
            </h1>
            <p className="text-xl text-white/80 max-w-md">
              Design custom sneakers that are uniquely yours with our 3D customization tool. Express yourself with every
              step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white rounded-full px-8 py-6 text-lg"
              >
                <Link href="/customize">Start Designing</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
              >
                <Link href="/products/men">Shop Collection</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-[500px] relative"
          >
            <div className="absolute inset-0 floating">
              <SneakerModel autoRotate={true} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-teal/20 rounded-full blur-[100px] -z-10"></div>
    </section>
  )
}

