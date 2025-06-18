import { NextResponse } from "next/server";

export async function GET(request) {
  // Get the Authorization header from the incoming request
  const authHeader = request.headers.get("authorization");

  // Proxy the request to your backend API
  const res = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/orders", {
    method: "GET",
    headers: {
      Authorization: authHeader || "",
      Accept: "application/json",
    },
  });

  // Forward the backend's JSON response
  const data = await res.json();
  return NextResponse.json(data);
}