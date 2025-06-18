import { NextResponse } from "next/server";

export async function POST(request, context) {
  try {
    const body = await request.json();
    const { editingAccount, token, ...payload } = body;
    const { params } = context;

    const { id } = typeof params.then === "function" ? await params : params;

    console.log("Update request for id:", id, "with body:", body);

    const url = editingAccount
      ? `https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/update/${id}`
      : "https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/update";

    const res = await fetch(url, {
      method: editingAccount ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: false, message: data.message || "Failed to save account." }, { status: 400 });
    }

    // Refetch accounts from /api/users for consistency
    const usersRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const usersData = await usersRes.json();

    return NextResponse.json({ success: true, users: usersData.users || [] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred." }, { status: 500 });
  }
}