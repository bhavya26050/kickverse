import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { parse } from "csv-parse/sync";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Read and parse the CSV file
    const content = await file.text();
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    });

    // Process each record from the CSV
    const products = records.map((record: any) => {
      const id = record.id || `nike-${record.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const sizes = (record.sizes || "7,8,9,10,11,12").split(",").map((s: string) => s.trim());
      const colors = parseColors(record.colors || "Black:#000000,White:#ffffff,Red:#ff0000");

      // Generate random inventory for each size and color combination
      const inventory = [];
      for (const size of sizes) {
        for (const color of colors) {
          inventory.push({
            size,
            color: color.name,
            quantity: Math.floor(Math.random() * 50) + 5, // Random quantity between 5 and 54
          });
        }
      }

      return {
        id,
        name: record.name,
        description: record.description || `Premium Nike ${record.name} shoes for maximum comfort and style.`,
        price: parseFloat(record.price) || 99.99,
        images: (record.images || "").split(",").map((url: string) => url.trim()),
        category: record.category || "men",
        subcategory: record.subcategory || "casual",
        sizes,
        colors,
        featured: record.featured === "true",
        inventory,
      };
    });

    // Insert products into database
    const result = await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: "Products imported successfully",
      count: result.length,
    });
  } catch (error) {
    console.error("Error importing products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to import products",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function parseColors(colorsString: string) {
  return colorsString.split(",").map((colorPair) => {
    const [name, value] = colorPair.split(":");
    return {
      name: name.trim(),
      value: value.trim(),
    };
  });
}
