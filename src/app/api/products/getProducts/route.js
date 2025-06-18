// src/app/api/products/getProducts/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("Authorization header received:", authHeader);

    if (!authHeader) {
      console.error("No token provided in Authorization header.");
      return NextResponse.json({ success: false, message: "No token provided." }, { status: 401 });
    }

    // This is the external API you are fetching from
    const externalApiUrl = "https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/products/prod";

    const res = await fetch(externalApiUrl, {
      headers: {
        Authorization: authHeader, // Forward the authorization token
        "Content-Type": "application/json",
      },
      // You might want to add cache: 'no-store' here if you want to ensure fresh data
      // For a server-side route, default caching behavior might be sufficient
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`External API error (${res.status} ${res.statusText}):`, errorText);
      // Pass the actual error from the external API for better debugging on client
      return NextResponse.json(
        { success: false, message: "Failed to fetch products from external API.", error: errorText, status: res.status },
        { status: 400 } // Keep 400 or use res.status if you want to proxy the external status
      );
    }

    const data = await res.json(); // 'data' is the actual JSON response from the ngrok API

    // --- CRITICAL CHANGE HERE ---
    // The ngrok API returns an array of products directly, not an object with a 'products' key.
    // So, we check if 'data' is an array and if it's not empty.
    if (!Array.isArray(data) || data.length === 0) {
      console.error("No products found or external API response was not an array:", data);
      return NextResponse.json(
        { success: false, message: "No products found or unexpected response format.", data },
        { status: 400 }
      );
    }

    // If 'data' is a non-empty array, it contains the products
    return NextResponse.json({ success: true, products: data }); // Send 'data' directly as 'products'
  } catch (error) {
    console.error("API route error during product fetch:", error);
    return NextResponse.json({ success: false, message: "An internal server error occurred.", error: error.message }, { status: 500 });
  }
}