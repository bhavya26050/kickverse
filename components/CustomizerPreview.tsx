"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import SneakerModel from "./SneakerModel"

export default function CustomizerPreview() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-teal/10 -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="glass-panel p-8 rounded-2xl neon-border">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Create Your <span className="text-gradient">Dream Kicks</span>
              </h2>
              <p className="text-white/70 mb-6">
                Our advanced 3D customization tool lets you design sneakers that are uniquely yours. Choose colors,
                materials, patterns, and even add custom text.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Real-time 3D preview",
                  "Multiple customization options",
                  "Save your designs",
                  "Share with friends",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-neon-teal mr-3"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 text-white rounded-full px-8 py-6 text-lg"
              >
                <Link href="/customize">
                  Start Designing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 h-[500px] relative"
          >
            <div className="absolute inset-0 floating">
              <SneakerModel autoRotate={true} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

