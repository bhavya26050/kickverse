import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const brand = searchParams.get("brand") || ""
    const limit = searchParams.get("limit") || "20"
    const page = searchParams.get("page") || "1"

    const url = `https://sneakers-api-6w4z.onrender.com/sneakers?limit=${limit}&page=${page}${query ? `&query=${query}` : ""}${brand ? `&brand=${brand}` : ""}`

    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "sneakers-api-6w4z.onrender.com",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Transform the data to match our product schema
    const transformedData = data.data.map((sneaker: any) => ({
      id: sneaker._id || sneaker.id || `sneaker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: sneaker.name || "Unknown Sneaker",
      description: sneaker.description || `${sneaker.brand} ${sneaker.name} sneakers.`,
      price: sneaker.retailPrice || sneaker.price || 149.99,
      images: sneaker.image?.original ||
        sneaker.image?.small ||
        sneaker.images || ["/placeholder.svg?height=400&width=400"],
      category: sneaker.gender?.toLowerCase() || "men",
      subcategory: sneaker.category?.toLowerCase() || "casual",
      sizes: sneaker.sizes || ["7", "8", "9", "10", "11", "12"],
      colors: [{ name: sneaker.colorway || "Default", value: "#000000" }],
      stock: Math.floor(Math.random() * 20) + 5, // Random stock between 5-25
      isNew: sneaker.releaseYear >= new Date().getFullYear() - 1,
      rating: Math.random() * 2 + 3, // Random rating between 3-5
      reviews: Math.floor(Math.random() * 50) + 1, // Random number of reviews
      brand: sneaker.brand || "Unknown",
    }))

    return NextResponse.json({
      success: true,
      count: data.count || transformedData.length,
      products: transformedData,
    })
  } catch (error) {
    console.error("Error fetching sneakers:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch sneakers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

