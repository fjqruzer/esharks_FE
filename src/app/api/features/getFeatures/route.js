import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("Authorization header received:", authHeader);

    if (!authHeader) {
      console.error("No token provided in Authorization header.");
      return NextResponse.json({ success: false, message: "No token provided." }, { status: 401 });
    }

    const externalApiUrl = "https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/features/feat";

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
        { success: false, message: "Failed to fetch features from external API.", error: errorText, status: res.status },
        { status: 400 }
      );
    }

    const data = await res.json();

    // Filter: Only include features with a ProductID
    const filteredFeatures = Array.isArray(data)
      ? data.filter((f) => f.ProductID !== null && f.ProductID !== undefined && f.ProductID !== "")
      : [];

    if (filteredFeatures.length === 0) {
      console.error("No features with ProductID found:", data);
      return NextResponse.json(
        { success: false, message: "No feature with ProductID found.", data },
        { status: 400 }
      );
    }

    // Return as 'features' for your frontend
    return NextResponse.json({ success: true, features: filteredFeatures });
  } catch (error) {
    console.error("API route error during feature fetch:", error);
    return NextResponse.json({ success: false, message: "An internal server error occurred.", error: error.message }, { status: 500 });
  }
}