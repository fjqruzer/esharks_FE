import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function POST(request, { params }) {
  try {
    const id = params.id
    const body = await request.json()
    const session = await getServerSession()
    const authHeader = request.headers.get("authorization") // <-- get from request

    const payload = {
      ProductID: Number(id),
      Size: body.Size,
      Quantity: body.Quantity,
    }

    const backendRes = await fetch(
      `https://snipe-enhanced-hopefully.ngrok-free.app/api/products/${id}/cart/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader, // <-- use header from request
        },
        body: JSON.stringify(payload),
      }
    )

    console.debug("DEBUG: Backend status", backendRes.status)
    console.debug("DEBUG: Backend headers", backendRes.headers)
    const text = await backendRes.text()
    console.debug("DEBUG: Backend raw text", text)

    let data = {}
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: "Invalid JSON from backend", raw: text }
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}