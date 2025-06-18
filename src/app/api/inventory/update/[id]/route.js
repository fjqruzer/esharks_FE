import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request, context) {
  const authHeader = headers().get("authorization");
  const formData = await request.formData();
  const { id } = context.params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Inventory ID is required in URL." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/inventory/update/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader || "",
          // Do NOT set Content-Type for FormData!
        },
        body: formData,
      }
    );
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok || !data || data.success === false) {
      return NextResponse.json(
        { success: false, message: data?.message || "Update failed", error: data?.error },
        { status: res.status }
      );
    }
    return NextResponse.json({
      success: true,
      message: data.message,
      inventory: data.inventory,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An error occurred.", error: error.message },
      { status: 500 }
    );
  }
}