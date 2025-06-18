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

    const res = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/category/add", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        // Do NOT set Content-Type for FormData!
      },
      body: formData,
    });

    const contentType = res.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      console.error("External API error:", data);
      return NextResponse.json(
        { success: false, message: "Failed to add category.", error: data },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category added successfully.",
      data,
    });
  } catch (error) {
    console.error("API route error during category add:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred.", error: error.message },
      { status: 500 }
    );
  }
}