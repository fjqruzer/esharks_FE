import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization"); // Get token from client request

    const response = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/user", {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users from external API");
    }
    const data = await response.json();
    return NextResponse.json({ users: data.users || data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}