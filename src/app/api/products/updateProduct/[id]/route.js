import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request, context) {
  console.log("---- [API] /api/products/updateProduct/[id] ----");
  const authHeader = headers().get("authorization");
  console.log("Authorization header:", authHeader ? "Present" : "Missing");

  const formData = await request.formData();
  // Log all form data keys/values
  for (let pair of formData.entries()) {
    console.log(`FormData: ${pair[0]} = ${pair[1]}`);
  }

  // Get the id from the dynamic route
  const { id } = context.params;
  console.log("Product ID from URL:", id);

  if (!id) {
    console.error("No product ID in URL");
    return NextResponse.json(
      { success: false, message: "Product ID is required in URL." },
      { status: 400 }
    );
  }

  // Forward all form data to Laravel
  try {
    console.log(`Forwarding to Laravel: /api/admin/products/update/${id}`);
    const res = await fetch(
      `https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/products/update/${id}`,
      {
        method: "PUT", // Laravel route accepts POST and PUT
        headers: {
          Authorization: authHeader || "",
          // Do NOT set Content-Type for FormData!
        },
        body: formData,
      }
    );
    console.log("Laravel response status:", res.status);
    const data = await res.json();
    console.log("Laravel response data:", data);

    if (!res.ok) {
      console.error("Laravel update failed:", data);
      return NextResponse.json(
        { success: false, message: data.message || "Update failed", error: data.error },
        { status: res.status }
      );
    }
    return NextResponse.json({
      success: true,
      message: data.message,
      product: data.product,
    });
  } catch (error) {
    console.error("Error forwarding to Laravel:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred.", error: error.message },
      { status: 500 }
    );
  }
}