import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const formData = await request.formData();

    // Debug: Log all form data
    for (let pair of formData.entries()) {
      console.log("[API] FormData:", pair[0], pair[1], pair[1] instanceof File ? "File" : typeof pair[1]);
    }
    console.log("[API] Auth header:", authHeader);

    const res = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/products/add", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        // Do NOT set Content-Type
      },
      body: formData,
    });


    if (!res.ok) {
      let errorText;
      try {
        errorText = await res.text();
      } catch {
        errorText = "Could not read error body";
      }
      console.error("External API error:", errorText);
      return NextResponse.json(
        { success: false, message: "Failed to add product.", error: errorText },
        { status: 400 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, product: data.product || data });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred.", error: error.message },
      { status: 500 }
    );
  }
}