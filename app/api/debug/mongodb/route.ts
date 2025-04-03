import { NextResponse } from "next/server"
import mongoose from "mongoose"
import dbConnect from "@/lib/mongodb"

export async function GET() {
  try {
    await dbConnect()
    
    // Check if MongoDB is connected
    const state = mongoose.connection.readyState
    
    let statusMessage = ""
    switch (state) {
      case 0:
        statusMessage = "Disconnected"
        break
      case 1:
        statusMessage = "Connected"
        break 
      case 2:
        statusMessage = "Connecting"
        break
      case 3:
        statusMessage = "Disconnecting"
        break
      default:
        statusMessage = "Unknown"
    }
    
    if (state === 1) {
      return NextResponse.json({ 
        success: true, 
        status: statusMessage,
        database: mongoose.connection.db.databaseName
      })
    } else {
      return NextResponse.json(
        { success: false, status: statusMessage, message: "MongoDB not connected" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("MongoDB debug error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "MongoDB connection check failed" 
      },
      { status: 500 }
    )
  }
}