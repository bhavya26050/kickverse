import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    
    // Connection state check
    const state = mongoose.connection.readyState;
    const stateMap = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };
    
    const statusMessage = stateMap[state] || "Unknown";
    
    if (state === 1) {
      // Get DB stats to confirm connection is working
      const stats = await mongoose.connection.db.stats();
      
      return NextResponse.json({
        success: true,
        status: statusMessage,
        database: mongoose.connection.db.databaseName,
        stats: {
          collections: stats.collections,
          objects: stats.objects,
        },
        connectionString: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
        serverInfo: mongoose.connection.db.serverConfig.s.options,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          status: statusMessage,
          message: "MongoDB not connected",
          connectionString: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("MongoDB debug error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "MongoDB connection check failed",
        connectionString: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
      },
      { status: 500 }
    );
  }
}