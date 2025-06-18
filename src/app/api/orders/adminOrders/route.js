export async function GET(request) {
  try {
    // Get JWT token from Authorization header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    const res = await fetch(`https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/orders`, {
      method: "GET",
      headers: {
        // "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch orders" }), { status: res.status })
    }

    const data = await res.json()
    return new Response(JSON.stringify({ orders: data }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}