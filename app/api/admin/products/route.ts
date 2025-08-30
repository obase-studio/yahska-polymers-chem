import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseHelpers } from "@/lib/supabase-helpers"

export async function GET() {
  try {
    await requireAuth()
    const products = await supabaseHelpers.getAllProducts()
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
    
    const result = await supabaseHelpers.createProduct(product)
    
    return NextResponse.json(
      { message: "Product created successfully", id: result?.[0]?.id },
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