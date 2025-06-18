// src/app/api/inventory/getInventory/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ success: false, message: "No token provided." }, { status: 401 });
    }

    const externalApiUrl = "https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/inventory/inv"

    const res = await fetch(externalApiUrl, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { success: false, message: "Failed to fetch inventory from external API.", error: errorText, status: res.status },
        { status: 400 }
      );
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { success: false, message: "No inventory items found or unexpected response format.", data },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, items: data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "An internal server error occurred.", error: error.message }, { status: 500 });
  }
}