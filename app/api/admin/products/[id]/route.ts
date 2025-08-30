import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseHelpers } from "@/lib/supabase-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const product = await supabaseHelpers.getProductById(parseInt(id))
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const product = await request.json()
    
    await supabaseHelpers.updateProduct(parseInt(id), product)
    
    return NextResponse.json(
      { message: "Product updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    
    await supabaseHelpers.deleteProduct(parseInt(id))
    
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}