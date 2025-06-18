import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("Authorization header received:", authHeader);

    if (!authHeader) {
      console.error("No token provided in Authorization header.");
      return NextResponse.json({ success: false, message: "No token provided." }, { status: 401 });
    }

    const externalApiUrl = "https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/category/cat";

    const res = await fetch(externalApiUrl, {
      headers: {
        Authorization: authHeader,
        // Do NOT set Content-Type for GET
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`External API error (${res.status} ${res.statusText}):`, errorText);
      return NextResponse.json(
        { success: false, message: "Failed to fetch categories from external API.", error: errorText, status: res.status },
        { status: 400 }
      );
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.error("No categories found or external API response was not an array:", data);
      return NextResponse.json(
        { success: false, message: "No category found or unexpected response format.", data },
        { status: 400 }
      );
    }

    // Return as 'categories' for your frontend
    return NextResponse.json({ success: true, categories: data });
  } catch (error) {
    console.error("API route error during category fetch:", error);
    return NextResponse.json({ success: false, message: "An internal server error occurred.", error: error.message }, { status: 500 });
  }
}