import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const apiRes = await fetch("https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/inventory/add", {
      method: "POST",
      headers: {
        Authorization: req.headers.get("authorization"),
        // Do NOT set Content-Type for FormData!
      },
      body: formData,
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add inventory", error: error.message },
      { status: 500 }
    );
  }
}