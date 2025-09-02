import { NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await verifySession()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: session
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}