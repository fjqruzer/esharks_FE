import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("[API] Received POST /api/features/addFeature");

    const authHeader = request.headers.get("authorization");
    console.log("[API] Auth header:", authHeader);

    const formData = await request.formData();

    // Debug: Log all form data
    for (let pair of formData.entries()) {
      console.log("[API] FormData:", pair[0], pair[1]);
    }

    const res = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/features/add", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        // Do NOT set Content-Type for FormData!
      },
      body: formData,
    });

    console.log("[API] Forwarded request to Laravel, waiting for response...");

    if (!res.ok) {
      let errorText;
      try {
        errorText = await res.text();
      } catch {
        errorText = "Could not read error body";
      }
      console.error("[API] External API error:", errorText);
      return NextResponse.json(
        { success: false, message: "Failed to add feature.", error: errorText },
        { status: 400 }
      );
    }

    const data = await res.json();
    console.log("[API] Laravel response data:", data);

    return NextResponse.json({ success: true, feature: data.feature || data });
  } catch (error) {
    console.error("[API] Route error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred.", error: error.message },
      { status: 500 }
    );
  }
}