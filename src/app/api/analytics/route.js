import { NextResponse } from "next/server"

const API_URL = "https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/analytics"

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization")
    console.log("[DEBUG] Forwarded Authorization header:", authHeader)

    const response = await fetch(API_URL, {
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    })

    const text = await response.text()
    console.log("[DEBUG] Raw response text:", text)

    if (!response.ok) {
      return NextResponse.json({ error: text || "Failed to fetch analytics data" }, { status: response.status })
    }

    let data
    try {
      data = JSON.parse(text)
      console.log("[DEBUG] Parsed JSON data:", data)
    } catch (jsonErr) {
      console.error("[DEBUG] JSON parse error:", jsonErr)
      return NextResponse.json({ error: "Response is not valid JSON" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[DEBUG] Caught error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}