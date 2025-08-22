import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { dbHelpers } from "@/lib/database"

export async function GET() {
  try {
    await requireAuth()
    const products = dbHelpers.getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const product = await request.json()
    
    const result = dbHelpers.createProduct(product)
    
    return NextResponse.json(
      { message: "Product created successfully", id: result.lastInsertRowid },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}